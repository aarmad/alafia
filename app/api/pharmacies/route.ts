import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import pharmaciesData from '@/data/pharmacies.json';

export async function GET() {
    try {
        await connectDB();

        // 1. Récupérer les pharmacies de la base de données
        const dbPharmacies = await User.find({ role: 'pharmacy' });

        // 2. Formater les pharmacies de la DB pour correspondre au type Pharmacy
        const formattedDbPharmacies = dbPharmacies.map(p => ({
            id: p._id.toString(),
            name: p.profile.pharmacyName,
            address: p.profile.address,
            phone: p.profile.phone,
            whatsapp: p.profile.whatsapp || p.profile.phone,
            quartier: p.profile.quartier || 'Lomé',
            latitude: p.profile.latitude || 6.137, // Position par défaut (Lomé)
            longitude: p.profile.longitude || 1.212,
            isOnDuty: p.profile.isOnDuty || false,
            hours: p.profile.hours || '8h-20h',
            medications: p.profile.medications?.map((m: any) => m.name) || []
        }));

        // 3. Fusionner avec les données statiques
        // Note: On pourrait aussi filtrer pour éviter les doublons si nécessaire
        const allPharmacies = [...pharmaciesData, ...formattedDbPharmacies];

        return NextResponse.json({
            success: true,
            data: allPharmacies
        });

    } catch (error: any) {
        console.error('Erreur pharmacies listing:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur lors de la récupération des pharmacies' },
            { status: 500 }
        );
    }
}
