import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const doctors = await User.find({ role: 'doctor' }, 'profile email _id').lean();

        const formattedDoctors = doctors.map((doc: any) => ({
            ...doc,
            _id: doc._id.toString()
        }));

        return NextResponse.json({ success: true, data: formattedDoctors });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
