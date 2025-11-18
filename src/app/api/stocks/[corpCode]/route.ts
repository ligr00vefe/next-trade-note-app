import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { corpCode: string } }
) {
  console.log('API Route /api/stocks/[corp_code] GET called.');
  const corp_code = params.corpCode; 

  if (!corp_code) {
    return NextResponse.json(
      { error: 'corp_code is required.' },
      { status: 400 }
    );
  }

  const DART_COMPANY_URL = process.env.DART_COMPANY_URL;
  const DART_API_KEY = process.env.DART_API_KEY;

  if (!DART_API_KEY) {
    return NextResponse.json(
      { error: 'DART_API_KEY is not defined in environment variables.' },
      { status: 500 }
    );
  }

  const dartApiUrl = `${DART_COMPANY_URL}?crtfc_key=${DART_API_KEY}&corp_code=${corp_code}`;
  console.log('dartApiUrl: ', dartApiUrl);
  try {
    const response = await fetch(dartApiUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => response.text()); // 응답 본문 파싱 시도
      console.error(
        `Dart API responded with status ${response.status} ${response.statusText}. Error Data: ${JSON.stringify(errorData)}`
      );
      throw new Error(`Dart API responded with status ${response.status}`);
    }
    const data = await response.json();
    console.log('company api response data: ', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Dart API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Dart API.' },
      { status: 500 }
    );
  }
}
