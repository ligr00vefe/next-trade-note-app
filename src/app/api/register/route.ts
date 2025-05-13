import bcrypt from 'bcryptjs';
import prisma from '@/helpers/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  const body = await request.json();

  const {
    email,
    name,
    password
  } = body;

  // 비밀번호 암호화(순수한 값과 salt할 번호를 넣어줌)
  const hashedPassword = await bcrypt.hash(password, 12);

  // prisma 객체를 이용해서 데이터를 읽거나 쓸 수 있다.
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    }
  })

  return NextResponse.json(user);
}