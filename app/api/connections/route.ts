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

// GET: Fetch pending requests OR current connections
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        await connectDB();
        const fullUser = await User.findById(user.userId)
            .populate('pendingRequests', 'email profile')
            .populate('connections', 'email profile');

        return NextResponse.json({
            success: true,
            data: {
                pendingRequests: fullUser.pendingRequests,
                connections: fullUser.connections
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Request OR Accept connection
export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { targetId, action } = await req.json(); // action: 'request' | 'accept' | 'reject'
        await connectDB();

        if (action === 'request') {
            // Un patient demande un docteur
            const doctor = await User.findById(targetId);
            if (!doctor || doctor.role !== 'doctor') {
                return NextResponse.json({ success: false, message: 'Médecin introuvable' }, { status: 404 });
            }

            // Ajouter à pendingRequests du docteur
            await User.findByIdAndUpdate(targetId, {
                $addToSet: { pendingRequests: user.userId }
            });

            return NextResponse.json({ success: true, message: 'Demande envoyée' });
        }

        if (action === 'accept') {
            // Un docteur accepte un patient
            // Add user.userId as doctor, targetId as patient
            const patient = await User.findById(targetId);
            const doctor = await User.findById(user.userId);

            if (!patient || !doctor) return NextResponse.json({ success: false, message: 'Utilisateur introuvable' }, { status: 404 });

            // 1. Ajouter aux connections mutuelles
            await User.findByIdAndUpdate(user.userId, {
                $addToSet: { connections: targetId },
                $pull: { pendingRequests: targetId }
            });
            await User.findByIdAndUpdate(targetId, {
                $addToSet: { connections: user.userId },
                // Et mettre à jour le profil chronic du patient avec le docteur attitré
                'profile.treatingDoctorId': user.userId,
                'profile.treatingDoctorName': doctor.profile.name
            });

            return NextResponse.json({ success: true, message: 'Demande acceptée' });
        }

        return NextResponse.json({ success: false, message: 'Action invalide' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
