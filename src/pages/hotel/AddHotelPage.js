import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOTEL_URL } from '../../config/user/host-config';
import RoomModal from './RoomModal';
import styles from './AddHotelPage.module.scss';

const AddHotelPage = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    businessOwner: '',
    location: '',
    rulesPolicy: '',
    cancelPolicy: '',
    price: '',
    phoneNumber: '',
    hotelImages: [{ hotelImgUri: '', type: '' }]
  });
  const [hotelId, setHotelId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const navigate = useNavigate();

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    const images = [...hotelData.hotelImages];
    images[index][name] = value;
    setHotelData({ ...hotelData, hotelImages: images });
  };

  const handleHotelSubmit = async (e) => {
    
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      console.log('Token:', token);

      const response = await fetch(`${HOTEL_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          'hotel-name': hotelData.name,
          'description': hotelData.description,
          'business-owner': hotelData.businessOwner,
          'location': hotelData.location,
          'rules-policy': hotelData.rulesPolicy,
          'cancel-policy': hotelData.cancelPolicy,
          'price': hotelData.price,
          'phone-number': hotelData.phoneNumber,
          'hotel-images': hotelData.hotelImages
        })
      });
      console.log("호텔 아이디 가지고잇냐 ", hotelId);

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.text();
        console.log('Response data:', data);
        setHotelId(data.id); // Ensure this key matches the key used in the server response
        setShowConfirmModal(true); // Show confirm modal
      } else {
        const errorData = await response.text();
        console.error('Error data:', errorData);
        setErrorMessage(errorData.message || 'Failed to add hotel');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('An error occurred while adding the hotel');
    }
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setShowRoomModal(true); // Show room modal
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    navigate('/hotel'); // Navigate to hotel page
  };

 

  return (
    <div className={styles.addHotelPage}>
      <form onSubmit={handleHotelSubmit}>
        <h1>Add Hotel</h1>
        <input
          type="text"
          name="name"
          placeholder="Hotel Name"
          value={hotelData.name}
          onChange={handleHotelChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={hotelData.description}
          onChange={handleHotelChange}
        />
        <input
          type="text"
          name="businessOwner"
          placeholder="Business Owner"
          value={hotelData.businessOwner}
          onChange={handleHotelChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={hotelData.location}
          onChange={handleHotelChange}
          required
        />
        <textarea
          name="rulesPolicy"
          placeholder="Rules Policy"
          value={hotelData.rulesPolicy}
          onChange={handleHotelChange}
        />
        <textarea
          name="cancelPolicy"
          placeholder="Cancel Policy"
          value={hotelData.cancelPolicy}
          onChange={handleHotelChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={hotelData.price}
          onChange={handleHotelChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={hotelData.phoneNumber}
          onChange={handleHotelChange}
          required
        />
        {hotelData.hotelImages.map((image, index) => (
          <div key={index}>
            <input
              type="text"
              name="hotelImgUri"
              placeholder="Hotel Image URI"
              value={image.hotelImgUri}
              onChange={(e) => handleImageChange(e, index)}
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Image Type"
              value={image.type}
              onChange={(e) => handleImageChange(e, index)}
              required
            />
          </div>
        ))}
        <button type="submit">Save Hotel</button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>

      {showConfirmModal && (
        <div className={styles.confirmModal}>
          <p>Hotel added successfully. Do you want to add rooms?</p>
          <button onClick={handleConfirmYes}>Yes</button>
          <button onClick={handleConfirmNo}>No</button>
        </div>
      )}

      {showRoomModal && <RoomModal hotelId={hotelId} onClose={() => setShowRoomModal(false)} />}

    </div>
  );
};

export default AddHotelPage;
