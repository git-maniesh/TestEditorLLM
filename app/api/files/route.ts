
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { File } from '@/models/File';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ files: [] }, { status:401 });
  const files = await File.find({ owner: session.user.id }).sort({ updatedAt:-1 }).lean();
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: 'Missing name' }, { status:400 });
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status:401 });
  const f = new File({ owner: session.user.id, name: body.name, type: body.type || 'file', content: body.content || '', parentId: body.parentId || null, language: body.language || 'javascript' });
  await f.save();
  return NextResponse.json({ file: f }, { status:201 });
}
