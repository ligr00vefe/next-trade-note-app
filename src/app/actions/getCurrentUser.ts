import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/helpers/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}

// 데이터베이스에 있는 유저 데이터를 가져오는 getCurrentUser 함수
export default async function getCurrentUser() {
  try {
    const session = await getSession();
    // console.log('session: ', session);
    // session.user에 email이 없을 경우
    if (!session?.user?.email) {
      // console.log('1');
      return null;
    }
    // console.log('session.user.email: ', session.user.email);

    // 이메일을 이용해서 데이터베이스에서 요청 정보 찾은 후 가져오기
    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session.user.email
      }
    });
    // console.log('getCurrentUser: ', currentUser);
    if (!currentUser) {
      // console.log('2');
      return null;
    }

    return currentUser;

  } catch (error) {
    return null;
  }
}