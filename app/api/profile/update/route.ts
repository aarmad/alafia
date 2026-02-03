import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';

export async function PUT(req: Request) {
    try {
        const userPayload = await getUserFromToken();
        if (!userPayload) {
            return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();
        const { updates } = body; // Un objet contenant les champs à mettre à jour dans 'profile'

        if (!updates) {
            return NextResponse.json({ success: false, message: 'Aucune donnée fournie' }, { status: 400 });
        }

        await connectDB();

        // Construction dynamique de l'objet de mise à jour pour MongoDB
        // Exemple: si updates = { isOnDuty: true }, on fait { "profile.isOnDuty": true }
        const mongoUpdates: any = {};
        for (const [key, value] of Object.entries(updates)) {
            mongoUpdates[`profile.${key}`] = value;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userPayload.userId,
            { $set: mongoUpdates },
            { new: true } // Retourne l'objet mis à jour
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profile: updatedUser.profile
                }
            }
        });

    } catch (error: any) {
        console.error('Erreur update profile:', error);
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
    }
}
