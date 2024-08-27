import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    uploadFile, submitRoom, updateRoomData,
    addRoomImage, removeRoomImage, setErrorMessage, resetRoomData
} from '../../components/store/hotel/RoomAddSlice';
import styles from './AddRoomPage.module.scss';
import {AUTH_URL} from '../../config/user/host-config'
import {getUserToken} from "../../config/user/auth";


const AddRoomPage = () => {
    const { hotelId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roomData = useSelector((state) => state.roomAdd);
    const isUploading = useSelector((state) => state.roomAdd.isUploading);

    // 이미지 URL 생성 함수
    const createImageUrl = (image) => {
        if (!image || !image.hotelImgUri) return '';
        return image.type === 'LOCAL'
            ? image.hotelImgUri
            : `${AUTH_URL}${image.hotelImgUri.replace('/local', '/hotel/images')}`;
    };

    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateRoomData({ [name]: value }));
    };

    const handleAddImage = () => {
        if (!isUploading) {
            dispatch(addRoomImage());
        }
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
        const token = getUserToken();
        dispatch(submitRoom({ roomData, token, hotelId }))
            .unwrap()
            .then((response) => {
                console.log('Room added successfully:', response);
                alert('룸 생성이 완료되었습니다.');
                dispatch(resetRoomData());
                navigate('/hotel');
            })
            .catch((error) => {
                console.error('Failed to add room:', error);
                dispatch(setErrorMessage(error));
            });
    };

    return (
        <div className={styles.addRoomPage}>
            <form onSubmit={handleRoomSubmit}>
                <h1>Add Room</h1>
                <input
                    type="text"
                    name="name"
                    placeholder="Room Name"
                    value={roomData.name}
                    onChange={handleRoomChange}
                    required
                />
                <textarea
                    name="content"
                    placeholder="Room Content"
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
                    placeholder="Room Price"
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
                                <img src={createImageUrl(image)} alt="ROOM" style={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}/>
                                <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                            </>
                        )}
                    </div>
                ))}
                <button className={styles.RoomCreateButton} type="button" onClick={handleAddImage}>Add Image</button>
                <button className={styles.RoomCreateButton} type="submit">Save Room</button>
                {roomData.errorMessage && <p className={styles.error}>{roomData.errorMessage}</p>}
            </form>
            <button onClick={() => navigate('/hotel')}>Back to List</button>
        </div>
    );
};

export default AddRoomPage;
