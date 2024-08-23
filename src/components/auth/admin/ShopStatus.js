import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ADMIN_URL } from '../../../config/user/host-config';
import styles from './ShopStatus.module.scss'; // 스타일 모듈 가져오기

const ShopStatus = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ADMIN_URL}/shop/best`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // API 응답 데이터를 필요한 형식으로 변환하여 상위 10개 항목만 추출
        const transformedData = Object.keys(result)
          .map(key => ({
            name: key,
            sales: result[key],
          }))
          .sort((a, b) => b.sales - a.sales) // 판매량 기준으로 내림차순 정렬
          .slice(0, 10); // 상위 10개만 추출

        setData(transformedData);
        console.log(transformedData); // 데이터 확인을 위한 로그
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>가장 많이 팔린 상품 Top 10</h2> {/* 그래프 제목 추가 */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip className={styles.tooltipStyle} />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" className={styles.bar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShopStatus;
