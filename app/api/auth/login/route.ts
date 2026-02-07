import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        await connectDB();

        // Trouver l'utilisateur
        const user = await User.findOne({ email }).catch(err => {
            console.error("Login DB Find error:", err);
            throw new Error("Erreur base de données");
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // Générer le token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'alafia_secret_key_change_me',
            { expiresIn: '7d' }
        );

        return NextResponse.json(
            {
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        profile: user.profile,
                    },
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Erreur API Connexion:', error);
        return NextResponse.json(
            { success: false, message: `Erreur : ${error.message || 'Erreur serveur'}` },
            { status: 500 }
        );
    }
}
