import React, { useState } from 'react';
import styles from './RoomModal.module.scss';  // 스타일 파일 임포트


const RoomModal = ({ onClose, onSubmit }) => {
  const [room, setRoom] = useState({
    name: '',
    type: '',
    price: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(room);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Add Room</h2>
        <input type="text" name="name" placeholder="Room Name" value={room.name} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Room Type" value={room.type} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={room.price} onChange={handleChange} required />
        <textarea name="content" placeholder="Room Content" value={room.content} onChange={handleChange} />
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default RoomModal;
