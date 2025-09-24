'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import styles from './UserManagement.module.scss';

interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  role: 'user' | 'admin';
}

export default function UserManagement() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출 대신 더미 데이터
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          name: '김철수',
          email: 'kim@example.com',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20',
          status: 'active',
          role: 'user',
        },
        {
          id: '2',
          name: '이영희',
          email: 'lee@example.com',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19',
          status: 'active',
          role: 'user',
        },
        {
          id: '3',
          name: '박관리자',
          email: 'admin@example.com',
          createdAt: '2024-01-01',
          lastLogin: '2024-01-20',
          status: 'active',
          role: 'admin',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>사용자 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>사용자 관리</h1>
        <p>등록된 사용자들을 관리하고 모니터링하세요</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="사용자 이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>전체 사용자</span>
            <span className={styles.statValue}>{users.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>활성 사용자</span>
            <span className={styles.statValue}>
              {users.filter(u => u.status === 'active').length}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>사용자</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>최근 로그인</th>
              <th>상태</th>
              <th>역할</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {user.name.charAt(0)}
                    </div>
                    <span className={styles.userName}>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>{user.lastLogin}</td>
                <td>
                  <button
                    onClick={() => handleStatusToggle(user.id)}
                    className={`${styles.statusBadge} ${
                      user.status === 'active' ? styles.active : styles.inactive
                    }`}
                  >
                    {user.status === 'active' ? '활성' : '비활성'}
                  </button>
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                    {user.role === 'admin' ? '관리자' : '사용자'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} title="수정">
                      <PencilIcon className={styles.actionIcon} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className={styles.deleteBtn}
                      title="삭제"
                    >
                      <TrashIcon className={styles.actionIcon} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
