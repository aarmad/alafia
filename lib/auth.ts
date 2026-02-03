import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'alafia_secret_key_change_me';

export async function getUserFromToken() {
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as { userId: string, email: string, role: string };
    } catch (error) {
        return null;
    }
}
