import { NextResponse } from 'next/server'
import issueData from '@/data/IssueData'

// GET 요청 처리
export async function GET() {
  return NextResponse.json(issueData)
}
