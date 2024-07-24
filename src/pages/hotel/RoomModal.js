import React, { useState } from 'react';
import { ROOM_URL , UPLOAD_URL } from '../../config/user/host-config';
import styles from './RoomModal.module.scss';

const RoomModal = ({ hotelId, onClose }) => {
  const [roomData, setRoomData] = useState({
    name: '',
    content: '',
    type: '',
    price: '',
    roomImages: [{ hotelImgUri: '', type: 'ROOM' }]
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    const images = [...roomData.roomImages];
    images[index][name] = value;
    setRoomData({ ...roomData, roomImages: images });
  };

  const handleAddImage = () => {
    setRoomData(prev => ({
      ...prev,
      roomImages: [...prev.roomImages, { hotelImgUri: '', type: '' }]
    }));
  };

  const handleRemoveImage = index => {
    setRoomData(prev => ({
      ...prev,
      roomImages: prev.roomImages.filter((_, i) => i !== index)
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

      const images = [...roomData.roomImages];
      images[index] = { hotelImgUri: data, type: 'image' };
      setRoomData({ ...roomData, roomImages: images });
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file');
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;

      const response = await fetch(`${ROOM_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          'room-name': roomData.name,
          'room-content': roomData.content,
          'room-type': roomData.type,
          'room-price': roomData.price,
          'room-images': roomData.roomImages.map(image => ({
            hotelImgUri: image.hotelImgUri,
            type: 'ROOM'
          })),
          'hotel-id': hotelId
        })
      });

      if (response.ok) {
        const data = await response.text();
        console.log('응답 데이터:', data);
        onClose(); // 방이 추가된 후 모달 닫기
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData.message || '방 추가에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('방 추가 중 오류가 발생했습니다.');
    }
  };

  return (
      <div className={styles.roomModal}>
        <form onSubmit={handleRoomSubmit}>
          <h1>방 추가</h1>
          <input
              type="text"
              name="name"
              placeholder="방 이름"
              value={roomData.name}
              onChange={handleRoomChange}
              required
          />
          <textarea
              name="content"
              placeholder="방 내용"
              value={roomData.content}
              onChange={handleRoomChange}
          />
          <input
              type="text"
              name="type"
              placeholder="방 타입"
              value={roomData.type}
              onChange={handleRoomChange}
              required
          />
          <input
              type="number"
              name="price"
              placeholder="방 가격"
              value={roomData.price}
              onChange={handleRoomChange}
              required
          />
          {roomData.roomImages.map((image, index) => (
          <div key={index}>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, index)}
              required
            />
            {image.hotelImgUri && (
              <>
                <img src={`${ROOM_URL}/images/${image.hotelImgUri}`} alt="Hotel" />
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
        <button type="submit">객실 저장</button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
        <button onClick={onClose}>닫기</button>
      </div>
  );
};

export default RoomModal;
