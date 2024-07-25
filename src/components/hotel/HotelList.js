import React from 'react';
import styles from './HotelList.module.scss';

const HotelList = ({ hotels }) => {
  return (
      <>
        {hotels.map(hotel => (
            <div key={hotel.id} className={styles.hotel}>
              <h2>{hotel.name}</h2>
              <p>{hotel.description}</p>
              <p>{hotel.location}</p>
              <p>{hotel.phoneNumber}</p>
              {/* Additional hotel information */}
            </div>
        ))}
      </>
  );
};

export default HotelList;
