// pages/index.tsx
import InfoClient from './InfoClient'
import { ISSUE_DATA } from '@/data/IssueData'

export default function Page() {
  // 서버 컴포넌트에서 데이터 import
  return (
      <InfoClient issues={ISSUE_DATA.issues} />
  )
}