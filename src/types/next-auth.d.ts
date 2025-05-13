import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    // user가 있을 때 추가하고 싶은 properties 입력
    user?: {
      // user가 있다면 id가 있을 수도 있음
      id?: string;
      // user가 있다면 role도 있을 수 있음
      role?: string;
      // user가 있다면 favoriteIds도 있을 수 있음
      favoriteIds?: string[];
    } & DefaultSession["user"];
  }
}