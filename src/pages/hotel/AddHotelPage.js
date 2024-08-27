import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    updateHotelData, updateImage, addImage, removeImage,
    setShowConfirmModal, setShowRoomModal, setErrorMessage,
    uploadFile, submitHotel, resetRoomData
} from '../../components/store/hotel/HotelAddSlice';
import styles from './AddHotelPage.module.scss';
import RoomModal from "./RoomModal";
import {AUTH_URL} from '../../config/user/host-config'
import {getUserToken} from "../../config/user/auth";

// 이미지 URL 생성 함수
const createImageUrl = (image) => {
    if (!image || !image.hotelImgUri) return '';
    return image.type === 'LOCAL'
        ? image.hotelImgUri
        : `${AUTH_URL}${image.hotelImgUri.replace('/local', '/hotel/images')}`;
};

const AddHotelPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hotelData, hotelId, errorMessage, showConfirmModal, showRoomModal } = useSelector((state) => state.hotelAdd);

    const handleHotelChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateHotelData({[name]: value}));
    };

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

    const handleHotelSubmit = (e) => {
        e.preventDefault();
        const token = getUserToken();
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

    const openKakaoAddress = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                dispatch(updateHotelData({location: data.address}));
            }
        }).open();
    };

    const backHandler = () => {
        navigate('/hotel');
    };

    const handleRoomAdded = () => {
        dispatch(resetRoomData());
        dispatch(setShowRoomModal(true));
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
                                <img
                                    src={createImageUrl(image)}
                                    alt="Hotel"
                                    style={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}
                                />
                                <input
                                    type="hidden"
                                    name="type"
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
                <button type="button" onClick={backHandler}>Back</button>
            </form>

            {showConfirmModal && (
                <div className={styles.confirmModal}>
                    <p>호텔이 저장 되었습니다! 객실 추가하시나요?</p>
                    <button onClick={handleConfirmYes}>Yes</button>
                    <button onClick={handleConfirmNo}>No</button>
                </div>
            )}

            {showRoomModal && (
                <RoomModal backHandler={backHandler} hotelId={hotelId} onClose={() => dispatch(setShowRoomModal(false))}
                           onRoomAdded={handleRoomAdded}/>
            )}
        </div>
    );
};

export default AddHotelPage;
