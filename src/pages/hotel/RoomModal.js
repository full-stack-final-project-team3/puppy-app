import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadFile, submitRoom, updateRoomData, addRoomImage, removeRoomImage, setErrorMessage } from '../../components/store/hotel/RoomAddSlice';
import styles from './RoomModal.module.scss';
import { ROOM_URL } from "../../config/user/host-config";

const RoomModal = ({ hotelId, onClose, onRoomAdded, backHandler }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roomData = useSelector((state) => state.roomAdd);

    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateRoomData({ [name]: value }));
    };

    const handleAddImage = () => {
        dispatch(addRoomImage());
    };

    const handleRemoveImage = (index) => {
        dispatch(removeRoomImage(index));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        dispatch(uploadFile({ file, index }));
    };

    const handleRoomSubmit = (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('userData')).token;
        dispatch(submitRoom({ roomData, token, hotelId }))
            .unwrap()
            .then((response) => {
                console.log('Room added successfully:', response);
                alert('룸 생성이 완료되었습니다.');
                onRoomAdded(); // 부모 컴포넌트에 룸 추가 완료 알림
            })
            .catch((error) => {
                console.error('Failed to add room:', error);
                dispatch(setErrorMessage(error));
            });
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
                <select
                    name="type"
                    value={roomData.type}
                    onChange={handleRoomChange}
                    required
                >
                    <option value="" disabled>Select Room Type</option>
                    <option value="SMALL_DOG">Small Dog</option>
                    <option value="MEDIUM_DOG">Medium Dog</option>
                    <option value="LARGE_DOG">Large Dog</option>
                </select>
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
                                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                            </>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddImage}>Add Image</button>
                <button type="submit">객실 저장</button>
                {roomData.errorMessage && <p className={styles.error}>{roomData.errorMessage}</p>}
            </form>
            <button onClick={onClose}>닫기</button>
            <button onClick={backHandler}>목록으로 돌아가기</button>
        </div>
    );
};

export default RoomModal;
