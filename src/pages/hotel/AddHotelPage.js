import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HOTEL_URL , UPLOAD_URL } from '../../config/user/host-config';
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
    hotelImages: [{ hotelImgUri: '', type: 'HOTEL' }]
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

  const handleAddImage = () => {
    setHotelData(prev => ({
      ...prev,
      hotelImages: [...prev.hotelImages, { hotelImgUri: '', type: '' }]
    }));
  };

  const handleRemoveImage = index => {
    setHotelData(prev => ({
      ...prev,
      hotelImages: prev.hotelImages.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${UPLOAD_URL}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.text();

      const images = [...hotelData.hotelImages];
      images[index] = { hotelImgUri: data, type: 'image' };
      setHotelData({ ...hotelData, hotelImages: images });
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file');
    }
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
  
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
          'hotel-images': hotelData.hotelImages.map(image => ({
            hotelImgUri: image.hotelImgUri,
            type: 'HOTEL'
          }))
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        setHotelId(data.id);
        setShowConfirmModal(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to add hotel');
      }
    } catch (error) {
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

  const openKakaoAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setHotelData({ ...hotelData, location: data.address });
      }
    }).open();
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
          <div className={styles.locationContainer}>
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={hotelData.location}
                onChange={handleHotelChange}
                required
            />
            <button type="button" onClick={openKakaoAddress}>Find Address</button>
          </div>
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
              type="file"
              onChange={(e) => handleFileChange(e, index)}
              required
            />
            {image.hotelImgUri && (
              <>
                <img src={`${HOTEL_URL}/images/${image.hotelImgUri}`} alt="Hotel" />
                <input
                  type="hidden"
                  name="type"
                  placeholder="Image Type"
                  value={image.type}
                  onChange={(e) => handleImageChange(e, index)}
                  required
                />
                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
              </>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddImage}>Add Image</button>
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
