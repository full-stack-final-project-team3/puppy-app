// src/components/hotel/HotelList.js
import React from 'react';
import styles from './HotelList.module.scss';

const HotelList = ({ hotels }) => {
  return (
    <>
      {hotels.map(hotel => (
        <div key={hotel.hotel_id} className={styles.hotel}>
          <h2>{hotel.name}</h2>
          <p>{hotel.description}</p>
          <p>{hotel.location}</p>
          <p>{hotel.phone_number}</p>
          {/* Additional hotel information */}
        </div>
      ))}
    </>
  );
};

export default HotelList;
