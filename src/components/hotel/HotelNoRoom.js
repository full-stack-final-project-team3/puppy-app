import React from 'react';
import styles from './HotelNoRoom.module.scss'; // Create this CSS module file for styling

const HotelNoRoom = () => {
  return (
    <div className={styles.noRoomContainer}>
      <img src="/pawpaw.png" alt="No results found" className={styles.noRoomImage} />
      <p>조회된 호텔이 없습니다. 🥲</p>
    </div>
  );
};

export default HotelNoRoom;
