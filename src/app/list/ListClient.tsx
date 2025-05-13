'use client';

import styles from './List.module.scss';
import { useEffect, useState } from 'react';

export default function ListClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>매매 리스트</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>종목명</th>
            <th>매수 금액</th>
            <th>보유 수량</th>
            <th>매수 종액</th>
            <th>구매 사유</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABC 사</td>
            <td>50.000</td>
            <td>10</td>
            <td>500.000 원</td>
            <td>매수</td>
          </tr>
          <tr>
            <td>DEF 주식</td>
            <td>72.500</td>
            <td>5</td>
            <td>362.500 원</td>
            <td>상장 가능성</td>
          </tr>
          <tr>
            <td>GHI Co.</td>
            <td>40.000</td>
            <td>20</td>
            <td>800.000 원</td>
            <td>매수</td>
          </tr>
          <tr>
            <td>JKL Electronics</td>
            <td>85.000</td>
            <td>8</td>
            <td>680.000 원</td>
            <td>재약하고 싶은 브랜드</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.formContainer}>
        <h2>종목명</h2>
        <input type="text" value="LMN 제약" readOnly className={styles.input} />

        <div className={styles.inlineInputs}>
          <div>
            <h2>매수 금액</h2>
            <input type="text" value="30.000" readOnly className={styles.input} />
          </div>
          <div>
            <h2>보유 수량</h2>
            <input type="text" value="15" readOnly className={styles.input} />
          </div>
        </div>

        <h2>구매 사유</h2>
        <input type="text" value="장기 투자를 위해" readOnly className={styles.input} />
      </div>
    </div>
  );
}
