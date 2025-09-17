import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/helpers/prismadb';

// GET /api/notices/[id] - 개별 공지사항 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!notice) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await prisma.notice.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return NextResponse.json(
      { error: '공지사항을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/notices/[id] - 공지사항 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.userType !== 'Admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, isImportant, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const existingNotice = await prisma.notice.findUnique({
      where: { id: params.id },
    });

    if (!existingNotice) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const notice = await prisma.notice.update({
      where: { id: params.id },
      data: {
        title,
        content,
        isImportant: isImportant || false,
        isPublished: isPublished !== false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    return NextResponse.json(
      { error: '공지사항 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/notices/[id] - 공지사항 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.userType !== 'Admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const existingNotice = await prisma.notice.findUnique({
      where: { id: params.id },
    });

    if (!existingNotice) {
      return NextResponse.json(
        { error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.notice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '공지사항이 삭제되었습니다.' });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    return NextResponse.json(
      { error: '공지사항 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
