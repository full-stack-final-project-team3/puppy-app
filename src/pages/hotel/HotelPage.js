import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { AUTH_URL } from '../../config/user/host-config';
import styles from './HotelPage.module.scss';

const HotelPage = () => {
  const userData = useLoaderData();
  const isAdmin = userData && userData.role === 'ADMIN';
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch(`${AUTH_URL}/hotel`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data.hotels);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className={styles.hotelPage}>
      <h1>Hotel Page</h1>
      {isAdmin && (
        <button className={styles.addHotelButton}>
          <Link to="/add-hotel" style={{ color: 'inherit', textDecoration: 'none' }}>호텔 추가</Link>
        </button>
      )}
      {hotels.map(hotel => (
        <div key={hotel.hotel_id}>
          <h2>{hotel.name}</h2>
          <p>{hotel.description}</p>
          <p>{hotel.location}</p>
          <p>{hotel.phone_number}</p>
          {/* 추가적인 호텔 정보 렌더링 */}
        </div>
      ))}
    </div>
  );
};

export default HotelPage;
