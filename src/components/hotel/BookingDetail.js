import React from 'react';
import PropTypes from 'prop-types';
import styles from './BookingDetail.module.scss';

const BookingDetail = ({ hotel, personCount, startDate, endDate }) => {
  const [roomCount, setRoomCount] = React.useState(1);

  if (!hotel) {
    console.log('No hotel data available');
    return <p>No hotel selected</p>;
  }

  const { name, rulesPolicy, cancelPolicy, room } = hotel;

  if (!room || room.length === 0) {
    console.log('No room data available');
    return <p>No rooms available</p>;
  }

  const selectedRoom = room[0];

  console.log('Selected Room:', selectedRoom);
  console.log('Room Images:', selectedRoom['room-images']);

  const handleIncrement = () => setRoomCount(roomCount + 1);
  const handleDecrement = () => setRoomCount(Math.max(1, roomCount - 1));

  const totalPrice = selectedRoom.price * roomCount;

  const getImageUrl = (imageUri) => {
    if (imageUri && imageUri.startsWith('/local/')) {
      return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
    }
    return imageUri;
  };

  return (
    <div className={styles.bookingDetail}>
      <h2>{name}</h2>
      <h3>{selectedRoom.name}</h3>
      <p>Type: {selectedRoom.type}</p>
      <p>Price: {selectedRoom.price}</p>
      <div className={styles.roomCount}>
        <button onClick={handleDecrement}>-</button>
        <span>{roomCount}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
      <div className={styles.priceDetails}>
        <span className={styles.priceLabel}>Total Price: </span>
        <span className={styles.priceValue}>{totalPrice}</span>
      </div>
      <div className={styles.roomImages}>
        {selectedRoom['room-images'] && selectedRoom['room-images'].map((image, index) => {
          const imageUrl = getImageUrl(image['hotelImgUri']);
          console.log(`Rendering image ${index}:`, imageUrl);
          return (
            <img key={index} src={imageUrl} alt={`Room image ${index}`} onError={(e) => console.error('Image failed to load:', e)} />
          );
        })}
      </div>
      <div className={styles.policies}>
        <p className={`${styles.policy} ${styles.rulesPolicy}`}>Rules Policy: {rulesPolicy}</p>
        <p className={`${styles.policy} ${styles.cancelPolicy}`}>Cancel Policy: {cancelPolicy}
          규정 안불러와짐, 규정들, 예약기간 날짜 받아야함, 강아지수받아
        </p>
      </div>
    </div>
  );
};

BookingDetail.propTypes = {
  hotel: PropTypes.object.isRequired,
  personCount: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default BookingDetail;
