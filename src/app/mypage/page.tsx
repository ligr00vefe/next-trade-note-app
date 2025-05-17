import { getServerSession } from 'next-auth';
import MypageClient from './MypageClient';

export default async function MypagePage() {
  const session = await getServerSession();
  // 필요한 데이터 fetch (예: 유저 정보, 포트폴리오 등)
  // const userData = await fetchUserData(session?.user?.id);

  return <MypageClient /* userData={userData} */ />;
}