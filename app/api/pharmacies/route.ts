import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import pharmaciesData from '@/data/pharmacies.json';

export async function GET() {
    let dbPharmacies: any[] = [];

    try {
        await connectDB();
        // Récupérer les pharmacies de la base de données
        dbPharmacies = await User.find({ role: 'pharmacy' });
    } catch (dbError) {
        console.error('Database connection error in pharmacies API:', dbError);
        // On continue avec dbPharmacies vide en cas d'erreur DB
    }

    try {
        // 2. Formater les pharmacies de la DB pour correspondre au type Pharmacy
        const formattedDbPharmacies = dbPharmacies.map(p => ({
            id: p._id.toString(),
            name: p.profile?.pharmacyName || 'Pharmacie sans nom',
            address: p.profile?.address || '',
            phone: p.profile?.phone || '',
            whatsapp: p.profile?.whatsapp || p.profile?.phone || '',
            quartier: p.profile?.quartier || 'Lomé',
            latitude: p.profile?.latitude || 6.137,
            longitude: p.profile?.longitude || 1.212,
            isOnDuty: p.profile?.isOnDuty || false,
            hours: p.profile?.hours || '8h-20h',
            medications: p.profile?.medications?.map((m: any) => typeof m === 'string' ? m : m.name) || []
        }));

        // 3. Fusionner avec les données statiques
        const allPharmacies = [...pharmaciesData, ...formattedDbPharmacies];

        return NextResponse.json({
            success: true,
            data: allPharmacies
        });

    } catch (error: any) {
        console.error('Erreur pharmacies listing formatting:', error);
        return NextResponse.json({
            success: true,
            data: pharmaciesData // Fallback ultime sur les données JSON uniquement
        });
    }
}
