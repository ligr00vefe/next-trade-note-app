import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

// 기존 작업 주석처리
// 로그인 한 id만 지정경로(/admin/:path*, /user)에 접근 가능, :path*는 하위 모든 경로를 의미
// export const config = { matcher: ["/admin/:path*", "/user"] } 

export async function middleware(req: NextRequest) {
  // secret 값은 /pages/api/auth/[...next-auth].tsx 파일의 jwt: secret 값과 일치해야 함.
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  // console.log('middleware_session: ', session);

  // URL 경로 값
  const pathname = req.nextUrl.pathname;
	// console.log('pathname: ', req.nextUrl.pathname);
  

  // 로그인된 유저만 접근 가능
  if ((pathname.startsWith("/list") || pathname.startsWith("/users")) && !session) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // 어드민 유저만 접근 가능
  if (pathname.startsWith("/admin") && (session?.role !== "Admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 로그인된 유저는 로그인, 회원가입 페이지에 접근 X
  if (pathname.startsWith("/auth-경로") && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 모두 해당하지 않을 경우 원하는 페이지로 그냥 이동
  return NextResponse.next();
}
