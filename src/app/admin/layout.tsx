import { redirect } from 'next/navigation';
import getCurrentUser from '@/actions/getCurrentUser';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import styles from './admin.module.scss';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // 관리자 권한 체크 (예시: 특정 이메일 도메인 또는 role 필드 체크)
  // if (!currentUser || !currentUser.email?.includes('admin')) {
  //   redirect('/login');
  // }
  if (!currentUser || currentUser.userType !== 'Admin') {
    redirect('/login');
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader user={currentUser || { name: null, email: null }} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
