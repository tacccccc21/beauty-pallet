import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const user = await prisma.user.create({
      data: { email, name },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    console.error('Prismaエラー:', err.message);
    return new NextResponse(`Prismaエラー: ${err.message}`, { status: 500 });
  }
}
