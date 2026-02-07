import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Clé secrète pour le token (à mettre dans .env normalement)
const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, ...profileData } = body;

        // Validation basique
        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, message: 'Email, mot de passe et rôle requis' },
                { status: 400 }
            );
        }

        await connectDB();
        console.log("DB Connected for registration of:", email);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email }).catch(err => {
            console.error("DB Find error:", err);
            throw new Error("Erreur de connexion à la base de données (Timeout?)");
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Cet email est déjà utilisé' },
                { status: 409 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Préparer les données du profil selon le rôle
        let userProfile: any = {};

        // Validation et restructuration des profils
        try {
            switch (role) {
                case 'pharmacy':
                    userProfile = {
                        pharmacyName: profileData.pharmacyName,
                        license: profileData.license,
                        address: profileData.address,
                        quartier: profileData.quartier || profileData.address,
                        phone: profileData.phone,
                        whatsapp: profileData.whatsapp || profileData.phone,
                    };
                    break;
                case 'pregnant':
                    userProfile = {
                        name: profileData.name,
                        phone: profileData.phone,
                        dueDate: profileData.dueDate ? new Date(profileData.dueDate) : new Date(),
                        weeksPregnant: parseInt(profileData.weeksPregnant) || 0,
                    };
                    break;
                case 'elderly':
                    userProfile = {
                        name: profileData.name,
                        phone: profileData.phone,
                        age: parseInt(profileData.age) || 0,
                        emergencyContact: profileData.emergencyContact,
                    };
                    break;
                case 'donor':
                    userProfile = {
                        name: profileData.name,
                        phone: profileData.phone,
                        bloodType: profileData.bloodType,
                        location: profileData.location,
                    };
                    break;
                case 'chronic':
                    userProfile = {
                        name: profileData.name,
                        phone: profileData.phone,
                        disease: profileData.disease,
                        medications: typeof profileData.medications === 'string'
                            ? profileData.medications.split(',').map((m: string) => m.trim()).filter((m: string) => m !== '')
                            : profileData.medications || [],
                    };
                    break;
                case 'doctor':
                    userProfile = {
                        name: profileData.name,
                        phone: profileData.phone,
                        specialization: profileData.specialization,
                        licenseNumber: profileData.licenseNumber,
                        hospital: profileData.hospital,
                    };
                    break;
                default:
                    return NextResponse.json({ success: false, message: 'Rôle invalide' }, { status: 400 });
            }
        } catch (profileErr) {
            console.error("Profile parsing error:", profileErr);
            return NextResponse.json({ success: false, message: "Données de profil invalides" }, { status: 400 });
        }

        // Créer l'utilisateur
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role,
            profile: userProfile,
        });

        // Générer le token JWT
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'alafia_secret_key_change_me',
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role,
                    profile: newUser.profile,
                },
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Erreur API Inscription:', error);
        return NextResponse.json(
            { success: false, message: `Erreur d'inscription : ${error.message || 'Erreur serveur'}` },
            { status: 500 }
        );
    }
}
