
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { File } from '@/models/File';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
  const { id } = (req as any).params;
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status:401 });
  const f = await File.findOne({ _id: id, owner: session.user.id }).lean();
  if (!f) return NextResponse.json({ error: 'Not found' }, { status:404 });
  return NextResponse.json({ file: f });
}

export async function PUT(req: Request) {
  const { id } = (req as any).params;
  const body = await req.json();
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status:401 });
  const update:any = {};
  if (body.content !== undefined) update.content = body.content;
  if (body.name) update.name = body.name;
  if (body.language) update.language = body.language;
  update.updatedAt = new Date();
  const f = await File.findOneAndUpdate({ _id: id, owner: session.user.id }, update, { new: true });
  if (!f) return NextResponse.json({ error: 'Not found' }, { status:404 });
  return NextResponse.json({ file: f });
}

export async function DELETE(req: Request) {
  const { id } = (req as any).params;
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status:401 });
  const f = await File.findOneAndDelete({ _id: id, owner: session.user.id });
  if (!f) return NextResponse.json({ error: 'Not found' }, { status:404 });
  return NextResponse.json({ message: 'Deleted' });
}
