import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, authId } = body;

    if (!email || !authId) {
      throw new Error('emailとauthIdは必須です');
    }

    // PrismaでDBに保存
    const user = await prisma.user.create({
      data: {
        email,
        name,
        authId,
      },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    console.error('エラー詳細:', err);
    return new NextResponse(`エラー詳細: ${err.message}`, { status: 500 });
  }
}
