import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './HotelConfirmation.module.scss';

const HotelConfirmation = ({ hotel, selectedRoom, startDate, endDate, totalPrice, user }) => {
  const personCount = useSelector(state => state.hotelPage.personCount);
  console.log('user: ', user);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
  };

  return (
    <div className={styles.bookingConfirmation}>
      <h2>Booking Confirmation</h2>
      <p>Hotel: {hotel['hotel-name']}</p>
      <p>Room: {selectedRoom.name}</p>
      <div className={styles.priceDetails}>
        <span className={styles.priceLabel}>Total Price: </span>
        <span className={styles.priceValue}>{totalPrice}</span>
      </div>
      <div className={styles.personCount}>
        <span>Person Count: {personCount}</span>
      </div>
      <div className={styles.dateDetails}>
        <p>Check-in Date: {formatDate(startDate)}</p>
        <p>Check-out Date: {formatDate(endDate)}</p>
      </div>
      <div className={styles.userInfo}>
        <p>User: {user.realName}</p> {/* Assuming user object has a name property */}
      </div>
      <button>Confirm Booking</button>
    </div>
  );
};

HotelConfirmation.propTypes = {
  hotel: PropTypes.shape({
    'hotel-name': PropTypes.string.isRequired,
  }).isRequired,
  selectedRoom: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired, // Adjust according to actual user properties
  }).isRequired,
};

export default HotelConfirmation;
