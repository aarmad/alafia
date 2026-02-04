import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

async function getAuthUser(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch {
        return null;
    }
}

// GET: Fetch health record for a patient (self or affiliated doctor)
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId') || user.userId;

        await connectDB();
        const patient = await User.findById(patientId);
        if (!patient) return NextResponse.json({ success: false, message: 'Patient introuvable' }, { status: 404 });

        // Vérifier permission
        const isSelf = patientId === user.userId;
        const isAffiliated = patient.connections.includes(user.userId);

        if (!isSelf && !isAffiliated) {
            return NextResponse.json({ success: false, message: 'Permission refusée' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: patient.profile.healthRecords || [] });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Add entry to health record (Only affiliated doctors)
export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { patientId, diagnosis, treatment, notes } = await req.json();
        await connectDB();

        const doctor = await User.findById(user.userId);
        const patient = await User.findById(patientId);

        if (!doctor || !patient) return NextResponse.json({ success: false, message: 'Utilisateur introuvable' }, { status: 404 });

        // Vérifier si le docteur est connecté au patient
        if (!patient.connections.includes(user.userId)) {
            return NextResponse.json({ success: false, message: 'Vous n\'êtes pas affilié à ce patient' }, { status: 403 });
        }

        const newEntry = {
            date: new Date(),
            doctorName: doctor.profile.name,
            doctorId: doctor._id,
            diagnosis,
            treatment,
            notes
        };

        await User.findByIdAndUpdate(patientId, {
            $push: { 'profile.healthRecords': newEntry }
        });

        return NextResponse.json({ success: true, message: 'Entrée ajoutée au carnet de santé' });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
