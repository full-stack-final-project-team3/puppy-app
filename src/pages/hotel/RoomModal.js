import React, { useState, useEffect } from 'react';
import { ROOM_URL, HOTEL_URL } from '../../config/user/host-config';
import styles from './RoomModal.module.scss';

const RoomModal = ({ onClose }) => {
  const [roomData, setRoomData] = useState({
    name: '',
    content: '',
    type: '',
    price: '',
    roomImages: [{ hotelImgUri: '', type: '' }]
  });
  const [hotelId, setHotelId] = useState(null); // hotelId 상태 추가
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 서버에서 hotelId를 받아오는 함수
    const fetchHotelId = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        const response = await fetch(`${HOTEL_URL}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHotelId(data.id); // hotelId 설정
          console.log('Hotel ID fetched:', data.id);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch hotel ID');
        }
      } catch (error) {
        setErrorMessage('Error occurred while fetching hotel ID');
      }
    };

    fetchHotelId();
  }, []);

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
          'room-images': roomData.roomImages,
          'hotel-id': hotelId // hotelId를 포함시킴
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
              type="text"
              name="hotelImgUri"
              placeholder="방 이미지 URI"
              value={image.hotelImgUri}
              onChange={(e) => handleImageChange(e, index)}
              required
            />
            <input
              type="text"
              name="type"
              placeholder="이미지 타입"
              value={image.type}
              onChange={(e) => handleImageChange(e, index)}
              required
            />
          </div>
        ))}
        <button type="submit">저장</button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default RoomModal;
