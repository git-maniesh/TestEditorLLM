
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status:400 });
    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: 'User exists' }, { status:400 });
    const u = new User({ email, password });
    await u.save();
    return NextResponse.json({ message: 'ok' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status:500 });
  }
}
