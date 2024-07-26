import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateHotelData, updateImage, addImage, removeImage,
  setShowConfirmModal, setShowRoomModal, setErrorMessage,
  uploadFile, submitHotel
} from '../../components/store/hotel/HotelAddSlice'; // 올바른 경로로 수정
import styles from './AddHotelPage.module.scss';
import {HOTEL_URL} from "../../config/user/host-config";
import RoomModal from "./RoomModal";

const AddHotelPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelData, hotelId, errorMessage, showConfirmModal, showRoomModal } = useSelector((state) => state.hotelAdd);

  // 입력값 처리함수
  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateHotelData({ [name]: value }));
  };

  // 이미지 파일 처리 함수
  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    dispatch(updateImage({ index, image: { [name]: value } }));
  };

  const handleAddImage = () => {
    dispatch(addImage());
  };

  const handleRemoveImage = (index) => {
    dispatch(removeImage(index));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    dispatch(uploadFile(file));
  };

  // 호텔 정보 제공 함수
  const handleHotelSubmit = (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userData')).token;
    dispatch(submitHotel({ hotelData, token }));
  };

  const handleConfirmYes = () => {
    dispatch(setShowConfirmModal(false));
    dispatch(setShowRoomModal(true));
  };

  const handleConfirmNo = () => {
    dispatch(setShowConfirmModal(false));
    navigate('/hotel');
  };

  // 주소 찾기
  const openKakaoAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        dispatch(updateHotelData({ location: data.address }));
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

        {showRoomModal && <RoomModal hotelId={hotelId} onClose={() => dispatch(setShowRoomModal(false))} />}
      </div>
  );
};

export default AddHotelPage;
