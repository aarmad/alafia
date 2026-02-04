import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const doctors = await User.find({ role: 'doctor' }, 'profile email _id')
            .lean();

        return NextResponse.json({ success: true, data: doctors });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
