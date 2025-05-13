import { PrismaClient } from "@prisma/client";

// 타입스크립트를 위한 선언부
declare global {
	// 인스턴스에 데이터가 할당되면 PrismaClient 타입을 받지만 할당받기 전에는 타입이 undefined가 되어야함.
  var prisma: PrismaClient | undefined;
}

// globalThis에 prisma 인스턴스 객체가 있거나 없으면 새로 PrismaClient에서 인스턴스 객체를 생성함.
const client = globalThis.prisma || new PrismaClient();

// development 환경에서만 동작하도록 조건처리
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// 모든 환경에서 prisma를 재사용 할 수 있도록 수정
globalThis.prisma = client;

export default client