import { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from 'bcryptjs';

import prisma from '@/helpers/prismadb';

export const authOptions: NextAuthOptions = { 
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "", 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" 
    }),
    NaverProvider({
			clientId: process.env.NAVER_CLIENT_ID || "",
			clientSecret: process.env.NAVER_CLIENT_SECRET || "",
		}),
		KakaoProvider({
			clientId: process.env.KAKAO_CLIENT_ID || "",
			clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
		}),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {

        // credentials 이메일이 없거나 credentials 패스워드가 없는 경우 error message 출력
        if(!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // user를 찾는 부분
        const user = await prisma.user.findUnique({
          // 찾을 컬럼 선택
          where: {
            email: credentials.email,
          }
        })

        // user가 없거나 user가 있는데 해쉬된 비밀번호가 없는 경우 error message 출력
        if(!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }
        
        // 비밀번호 체크 - compare 매개변수 2개(pure 비밀번호, 해쉬된 비밀번호)를 입력하면 일치하는지 여부확인 해준다.
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        // pure 패스워드와 해쉬된 비밀번호가 일치하지 않을 때 error message 출력
        if(!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60 // 30 days (유효기간)
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user}) {
      return { ...token, ...user }
    },
    // jwt에서 return 되는 값이 session의 token 인자값으로 들어감.
    async session({ session, token }) {
      session.user = token;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
