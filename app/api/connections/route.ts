import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

async function getAuthUser(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
        const token = authHeader.split(' ')[1];
        if (!token || token === 'null' || token === 'undefined') return null;

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch (e) {
        return null;
    }
}

// GET: Fetch pending requests AND current connections
export async function GET(req: Request) {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) {
            return NextResponse.json({ success: false, message: 'Sessions expirée ou non autorisée' }, { status: 401 });
        }

        await connectDB();

        const userDoc = await User.findById(authUser.userId);
        if (!userDoc) {
            return NextResponse.json({ success: false, message: 'Utilisateur non trouvé dans la base' }, { status: 404 });
        }

        // Utilisation de find $in au lieu de populate pour éviter les erreurs de registration de modèle
        const pendingDocs = await User.find(
            { _id: { $in: userDoc.pendingRequests || [] } },
            'email profile role'
        ).lean();

        const connectionDocs = await User.find(
            { _id: { $in: userDoc.connections || [] } },
            'email profile role'
        ).lean();

        const pendingRequests = pendingDocs.map((u: any) => ({ ...u, _id: u._id.toString() }));
        const connections = connectionDocs.map((u: any) => ({ ...u, _id: u._id.toString() }));

        return NextResponse.json({
            success: true,
            data: {
                pendingRequests: pendingRequests || [],
                connections: connections || []
            }
        });

    } catch (error: any) {
        console.error("CRITICAL ERROR in /api/connections GET:", error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

// POST: Request OR Accept connection
export async function POST(req: Request) {
    try {
        const authUser = await getAuthUser(req);
        if (!authUser) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { targetId, action } = await req.json();
        if (!targetId || !action) {
            return NextResponse.json({ success: false, message: 'Cible et action requises' }, { status: 400 });
        }

        await connectDB();

        if (action === 'request') {
            const doctor = await User.findById(targetId);
            if (!doctor || doctor.role !== 'doctor') {
                return NextResponse.json({ success: false, message: 'Médecin introuvable' }, { status: 404 });
            }

            if (targetId === authUser.userId) {
                return NextResponse.json({ success: false, message: 'Action impossible' }, { status: 400 });
            }

            // Vérifier si une demande est déjà en cours ou si déjà connectés
            const isAlreadyPending = doctor.pendingRequests?.some((id: any) => id.toString() === authUser.userId);
            const isAlreadyConnected = doctor.connections?.some((id: any) => id.toString() === authUser.userId);

            if (isAlreadyPending) {
                return NextResponse.json({ success: false, message: 'Une demande est déjà en attente pour ce médecin' }, { status: 400 });
            }
            if (isAlreadyConnected) {
                return NextResponse.json({ success: false, message: 'Vous êtes déjà connectés à ce médecin' }, { status: 400 });
            }

            await User.findByIdAndUpdate(targetId, {
                $addToSet: { pendingRequests: authUser.userId }
            });

            return NextResponse.json({ success: true, message: 'Demande envoyée' });
        }

        if (action === 'accept') {
            const patient = await User.findById(targetId);
            const doctor = await User.findById(authUser.userId);

            if (!patient || !doctor) {
                return NextResponse.json({ success: false, message: 'Utilisateur introuvable' }, { status: 404 });
            }

            // Mettre à jour le docteur
            await User.findByIdAndUpdate(authUser.userId, {
                $addToSet: {
                    connections: targetId,
                    'profile.followedPatients': targetId // Optionnel mais cohérent
                },
                $pull: { pendingRequests: targetId }
            });

            // Mettre à jour le patient
            await User.findByIdAndUpdate(targetId, {
                $addToSet: { connections: authUser.userId },
                'profile.treatingDoctorId': authUser.userId,
                'profile.treatingDoctorName': doctor.profile.name
            });

            return NextResponse.json({ success: true, message: 'Demande acceptée' });
        }

        if (action === 'reject') {
            await User.findByIdAndUpdate(authUser.userId, {
                $pull: { pendingRequests: targetId }
            });
            return NextResponse.json({ success: true, message: 'Demande rejetée' });
        }

        return NextResponse.json({ success: false, message: 'Action invalide' }, { status: 400 });

    } catch (error: any) {
        console.error("CRITICAL ERROR in /api/connections POST:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
