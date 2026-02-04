import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Message from '@/models/Message';
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

// GET: Fetch messages with a specific contact
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const contactId = searchParams.get('contactId');

        await connectDB();

        const messages = await Message.find({
            $or: [
                { sender: user.userId, receiver: contactId },
                { sender: contactId, receiver: user.userId }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json({ success: true, data: messages });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Send a message
export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });

        const { receiverId, content } = await req.json();
        await connectDB();

        // Vérifier si les utilisateurs sont connectés
        const sender = await User.findById(user.userId);
        if (!sender.connections?.includes(receiverId)) {
            return NextResponse.json({ success: false, message: 'Vous n\'êtes pas connectés' }, { status: 403 });
        }

        const newMessage = await Message.create({
            sender: user.userId,
            receiver: receiverId,
            content
        });

        return NextResponse.json({ success: true, data: newMessage });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
