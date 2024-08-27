import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoom, uploadFile } from '../../components/store/hotel/RoomAddSlice';
import { fetchRooms } from '../../components/store/hotel/RoomAddSlice';
import { AUTH_URL } from '../../config/user/host-config';
import styles from './ModifyRoomPage.module.scss';

const ModifyRoomPage = () => {
    const {roomId} = useParams()
    const location = useLocation();
    const { hotel, room: initialRoomData } = location.state || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const room = useSelector(state => state.roomAdd.rooms.find(room => room['room-id'] === roomId) || {});

    const [roomData, setRoomData] = useState({
        name: '',
        content: '',
        type: '',
        price: '',
        roomImages: [],
        hotelId: hotel ? hotel['hotel-id'] : ''
    });





    useEffect(() => {
        if (!room || Object.keys(room).length === 0) {
            dispatch(fetchRooms(roomId));
        } else {
            setRoomData({
                ...room,
                roomImages: room['room-images'] || [],
                hotelId: hotel ? hotel['hotel-id'] : room['hotel-id']
            });
        }
    }, [dispatch]);

    useEffect(() => {
        if (initialRoomData) {
            setRoomData({
                ...initialRoomData,
                roomImages: initialRoomData['room-images'] || [],
                hotelId: hotel ? hotel['hotel-id'] : initialRoomData['hotel-id']
            });
        }
    }, []);


    const handleChange = (e) => {
        if (e.target.name === 'roomImages') {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
                dispatch(uploadFile({ file })).then(response => {
                    const imageUrl = response.payload.data; // 서버에서 반환된 URL

                    setRoomData(prevState => ({
                        ...prevState,
                        roomImages: [...prevState.roomImages, {
                            hotelImgUri: imageUrl, // 서버에서 반환된 URL
                            type: 'ROOM'
                        }]
                    }));
                }).catch(error => {
                    console.error('Error handling file upload:', error);
                });
            });
        } else {
            setRoomData({
                ...roomData,
                [e.target.name]: e.target.value
            });
        }
    };



    const handleDeleteImage = (index) => {
        setRoomData({
            ...roomData,
            roomImages: roomData.roomImages.filter((_, imgIndex) => imgIndex !== index)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const roomDataWithHotelId = {
            ...roomData,
            hotelId: hotel ? hotel['hotel-id'] : room['hotel-id']
        };


        dispatch(updateRoom({ roomId, roomData: roomDataWithHotelId }))
            .unwrap()
            .then(() => {
                alert('방 수정 성공');
                navigate('/hotel'); // 이동 경로 수정
            })
            .catch((error) => {
                console.error("업데이트 실패:", error);
                alert('방 수정 실패: ' + error.message);
            });
    };

    return (
        <div className={styles.modifyRoomPage}>
            <h1>Modify Room</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="room_name"
                        required
                        value={roomData['room_name']}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="room-price"
                        required
                        value={roomData['room-price']}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="room-content"
                        required
                        value={roomData['room-content']}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select
                        name="room-type"
                        required
                        value={roomData['room-type']}
                        onChange={handleChange}
                    >
                        <option value="SMALL_DOG">Small Dog</option>
                        <option value="MEDIUM_DOG">Medium Dog</option>
                        <option value="LARGE_DOG">Large Dog</option>
                    </select>
                </div>
                <div>
                    <label>Room Images:</label>
                    <input type="file" name="roomImages" multiple onChange={handleChange} />
                    <div className={styles.imageGallery}>
                        {roomData.roomImages.map((image, index) => {
                            const imageUrl = (typeof image.hotelImgUri === 'string' && image.hotelImgUri.startsWith('/local')) || image.type === 'LOCAL'
                                ? `${AUTH_URL}${image.hotelImgUri.replace('/local', '/hotel/images')}`
                                : image.hotelImgUri;

                            return (
                                <div key={index} className={styles.imageContainer}>
                                    <img
                                        src={imageUrl}
                                        alt={`${roomData.name} 이미지`}
                                        style={{maxWidth: '150px', maxHeight: '150px', width: 'auto', height: 'auto'}}
                                    />
                                    <button type="button" onClick={() => handleDeleteImage(index)}>
                                        Delete
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ModifyRoomPage;
