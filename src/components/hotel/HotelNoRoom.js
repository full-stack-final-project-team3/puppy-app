import React from 'react';
import styles from './HotelNoRoom.module.scss';

const HotelNoRoom = ({message}) => {
    return (
        <div className={styles.noRoomContainer}>
            <img src="/pawpaw.png" alt="No results found" className={styles.noRoomImage}/>
            <p>{message}</p>
        </div>
    );
};


export default HotelNoRoom;
