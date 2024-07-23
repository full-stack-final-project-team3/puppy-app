import React, { useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import styles from './HotelPage.module.scss';

const HotelPage = () => {
  const userData = useLoaderData();
  const isAdmin = userData && userData.role === 'ADMIN';

  useEffect(() => {
    console.log('User data:', userData); // 디버깅용 로그
    console.log('Is Admin:', isAdmin); // 디버깅용 로그
  }, [userData, isAdmin]);

  return (
    <div className={styles.hotelPage}>
      <h1>Hotel Page</h1>
      {isAdmin && (
        <button className={styles.addHotelButton}>
          <Link to="/add-hotel" style={{ color: 'inherit', textDecoration: 'none' }}>호텔 추가</Link>
        </button>
      )}
      {/* 추가적인 호텔 목록이나 다른 내용 */}
    </div>
  );
};

export default HotelPage;
