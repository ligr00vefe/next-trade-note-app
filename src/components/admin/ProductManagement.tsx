'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import styles from './ProductManagement.module.scss';

interface Product {
  id: string;
  company: string;
  category: string;
  theme1: string;
  theme2: string;
  currentPrice: number;
  totalQuantity: number;
  totalTrades: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출 대신 더미 데이터
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          company: '삼성전자',
          category: '대형주',
          theme1: '반도체',
          theme2: '기술주',
          currentPrice: 75000,
          totalQuantity: 15420,
          totalTrades: 342,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
        },
        {
          id: '2',
          company: 'SK하이닉스',
          category: '대형주',
          theme1: '반도체',
          theme2: '메모리',
          currentPrice: 125000,
          totalQuantity: 8950,
          totalTrades: 198,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-19',
        },
        {
          id: '3',
          company: 'NAVER',
          category: '대형주',
          theme1: 'IT서비스',
          theme2: '플랫폼',
          currentPrice: 185000,
          totalQuantity: 6780,
          totalTrades: 156,
          createdAt: '2024-01-08',
          updatedAt: '2024-01-18',
        },
        {
          id: '4',
          company: '카카오',
          category: '대형주',
          theme1: 'IT서비스',
          theme2: '모바일',
          currentPrice: 52000,
          totalQuantity: 12340,
          totalTrades: 287,
          createdAt: '2024-01-12',
          updatedAt: '2024-01-17',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', '대형주', '중형주', '소형주'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.theme1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.theme2.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>상품 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.productManagement}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>상품 관리</h1>
          <p>등록된 주식 상품들을 관리하고 모니터링하세요</p>
        </div>
        <button className={styles.addBtn}>
          <PlusIcon className={styles.addIcon} />
          새 상품 추가
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="회사명, 테마로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filters}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '전체 카테고리' : category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>전체 상품</span>
            <span className={styles.statValue}>{products.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>총 거래량</span>
            <span className={styles.statValue}>
              {products.reduce((sum, p) => sum + p.totalQuantity, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>회사명</th>
              <th>카테고리</th>
              <th>테마</th>
              <th>현재가</th>
              <th>총 보유량</th>
              <th>거래 횟수</th>
              <th>등록일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.companyInfo}>
                    <div className={styles.companyLogo}>
                      {product.company.charAt(0)}
                    </div>
                    <span className={styles.companyName}>{product.company}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.categoryBadge} ${styles[product.category]}`}>
                    {product.category}
                  </span>
                </td>
                <td>
                  <div className={styles.themes}>
                    <span className={styles.theme}>{product.theme1}</span>
                    <span className={styles.theme}>{product.theme2}</span>
                  </div>
                </td>
                <td className={styles.price}>
                  {product.currentPrice.toLocaleString()}원
                </td>
                <td className={styles.quantity}>
                  {product.totalQuantity.toLocaleString()}주
                </td>
                <td className={styles.trades}>
                  {product.totalTrades}건
                </td>
                <td>{product.createdAt}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} title="수정">
                      <PencilIcon className={styles.actionIcon} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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

      {filteredProducts.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
