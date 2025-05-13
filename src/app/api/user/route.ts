import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// GET 요청 처리
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // 성공적인 응답 반환
    return NextResponse.json({ currentUser });
  } catch (error) {
    // 오류 처리
    return NextResponse.json({ error: 'Error fetching user' });
  }
}