'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import Sell from '@/components/popup/Sell';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter } from 'next/navigation';
import { ITradeListProps } from '@/actions/getTradeList';
import { formatNumber } from '@/helpers/formatNumber';
import { useTheme } from '@/contexts/ThemeContext';
import clsx from 'clsx';

interface IListClientProps {
  allTradeList: ITradeListProps[];
}

export default function ListClient({ allTradeList }: IListClientProps) {
  const [mounted, setMounted] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ITradeListProps | null>(null);
  const [buyData, setBuyData] = useState({
    category: '',
    company: '',
    totalQuantity: '',
    totalPrice: '',
    avgPrice: '',
    theme1: '',
    theme2: '',
    isAdditionalBuy: false,
  });

  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleBuyClick = (row: ITradeListProps) => {
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    setBuyData({
      ...row,
      category: row.category,
      company: row.company,
      totalQuantity: String(row.totalQuantity),
      totalPrice: String(row.totalPrice),
      avgPrice: String(row.avgPrice),
      theme1: row.theme1 || '',
      theme2: row.theme2 || '',
      isAdditionalBuy: true,
    });
    setBuyOpen(true);
  };

  const handleBuyClose = () => {
    setBuyOpen(false);
    router.refresh();
  };

  const handleAddNewBuy = () => {
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    setBuyData({
      category: '',
      company: '',
      totalQuantity: '',
      totalPrice: '',
      avgPrice: '',
      theme1: '',
      theme2: '',
      isAdditionalBuy: false,
    });
    setBuyOpen(true);
  };

  const handleSellClick = (product: ITradeListProps) => {
    if (buyOpen) {
      setBuyOpen(false);
    }

    const currentProduct = allTradeList.find(item => item.id === product.id);
    if (currentProduct) {
      setSelectedProduct(currentProduct);
      setSellOpen(true);
    }
  };

  const handleSellClose = () => {
    setSellOpen(false);
    setSelectedProduct(null);
    router.refresh();
  };

  return (
    <Container>
      <div className={styles['list-root']}>
        <div className={styles['list-header']}>
          <h1 className={styles['list-title']}>매매 리스트</h1>
          <button
            className={styles['add-buy-btn']}
            tabIndex={0}
            aria-label="신규 매수"
            onClick={handleAddNewBuy}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleAddNewBuy()}
          >
            신규 매수
          </button>
        </div>
        <table className={styles['list-table']}>
          <thead className={styles['list-thead']}>
            <tr className={styles['list-tr']}>
              <th className={styles['list-th']}>분류</th>
              <th className={styles['list-th']}>종목명</th>
              <th className={styles['list-th']}>평균 매수 금액</th>
              <th className={styles['list-th']}>보유 수량</th>
              <th className={styles['list-th']}>총 매수 금액</th>
              <th className={styles['list-th']}>테마</th>
              <th className={styles['list-th']}>매매</th>
            </tr>
          </thead>
          <tbody>
            {allTradeList && allTradeList.map((product) => (
              <tr key={product.id} className={styles['list-tr']}>
                <td className={styles['list-td']}>{product.category}</td>
                <td className={clsx(styles['list-td'], styles['list-td-company'])}>{product.company}</td>
                <td className={clsx(styles['list-td'], styles['list-td-price'])}>{formatNumber(product.avgPrice)}</td>
                <td className={clsx(styles['list-td'], styles['list-td-quantity'])}>{product.totalQuantity}</td>
                <td className={clsx(styles['list-td'], styles['list-td-total-price'])}>{formatNumber(product.totalPrice)}</td>
                <td className={styles['list-td']}>{(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}</td>
                <td className={styles['list-td']}>
                  <button
                    className={styles['add-buy-btn']}
                    tabIndex={0}
                    aria-label={`${product.company} 추가 매수`}
                    onClick={() => handleBuyClick(product)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(product)}
                  >
                    추가 매수
                  </button>
                  <button
                    className={styles['sell-btn']}
                    tabIndex={0}
                    aria-label={`${product.company} 매도`}
                    onClick={() => handleSellClick(product)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSellClick(product)}
                  >
                    매도
                  </button>
                </td>
              </tr>
            ))}
            {allTradeList && allTradeList.length === 0 && (
              <tr className={styles['list-tr']}>
                <td className={clsx(styles['list-td'], styles['list-td-empty'])} colSpan={8} style={{ textAlign: 'center' }}>
                  등록된 매매 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Buy
          key={buyData.company}
          open={buyOpen}
          onClose={handleBuyClose}
          category={buyData.category}
          company={buyData.company}
          theme1={buyData.theme1}
          theme2={buyData.theme2}
          isAdditionalBuy={buyData.isAdditionalBuy}
        />

        {selectedProduct && (
          <Sell
            key={selectedProduct.id}
            open={sellOpen}
            onClose={handleSellClose}
            category={selectedProduct.category}
            company={selectedProduct.company}
            theme1={selectedProduct.theme1 || ''}
            theme2={selectedProduct.theme2 || ''}
            totalQuantity={selectedProduct.totalQuantity}
            totalPrice={selectedProduct.avgPrice}
          />
        )}
      </div>
    </Container>
  );
}
