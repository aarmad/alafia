import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Publication from '@/models/Publication';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        let query = {};
        if (type) {
            query = { type };
        }

        const publications = await Publication.find(query)
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(20);

        return NextResponse.json({ success: true, data: publications });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verify(token, JWT_SECRET) as any;

        await connectDB();
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== 'doctor') {
            return NextResponse.json({ success: false, message: 'Seuls les docteurs peuvent publier' }, { status: 403 });
        }

        const body = await req.json();
        const { title, content, type, image } = body;

        const newPublication = await Publication.create({
            title,
            content,
            type,
            image,
            author: user._id,
            authorName: user.profile.name,
            authorSpecialization: user.profile.specialization
        });

        return NextResponse.json({ success: true, data: newPublication }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
