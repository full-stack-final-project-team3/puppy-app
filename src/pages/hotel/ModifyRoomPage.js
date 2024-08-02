import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoom, uploadFile } from '../../components/store/hotel/RoomAddSlice';
import { fetchRooms } from '../../components/store/hotel/HotelPageSlice';
import styles from './ModifyRoomPage.module.scss';

const ModifyRoomPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const { hotel, room: initialRoomData } = location.state || {};
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const room = useSelector(state => state.roomAdd.rooms.find(room => room['room-id'] === roomId) || {});
    
    console.log('room: ', room);
    const [roomData, setRoomData] = useState({
        name: '',
        content: '',
        type: '',
        price: '',
        roomImages: [], // 초기값을 빈 배열로 설정
        hotelId: hotel ? hotel['hotel-id'] : ''
    });

    console.log('hotel: ', roomData.hotelId);

    useEffect(() => {
        if (!room || Object.keys(room).length === 0) {
            dispatch(fetchRooms(roomId));
        } else {
            setRoomData({
                ...room,
                roomImages: room['room-images'] || [], // roomImages가 undefined일 경우 빈 배열 사용
                hotelId: hotel ? hotel['hotel-id'] : room['hotel-id']
            });
        }
    }, [dispatch, roomId, room, hotel]);

    useEffect(() => {
        if (initialRoomData) {
            setRoomData({
                ...initialRoomData,
                roomImages: initialRoomData['room-images'] || [],
                hotelId: hotel ? hotel['hotel-id'] : initialRoomData['hotel-id']
            });
        }
    }, [initialRoomData, hotel]);


    const handleChange = (e) => {
        if (e.target.name === 'roomImages') {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
                dispatch(uploadFile(file)).then(response => {
                    // 서버에서 반환하는 파일 URL이 올바른지 확인
                    const imageUrl = response.payload; // 서버가 URL을 반환한다고 가정

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
        const roomDataWithHotelId = { ...roomData, hotelId: hotel ? hotel['hotel-id'] : room['hotel-id'] };
        console.log('Submitting room data:', roomDataWithHotelId); // 디버깅용 로그 추가
        dispatch(updateRoom({ roomId, roomData: roomDataWithHotelId }))
            .unwrap()
            .then(() => {
                alert('방 수정 성공');
                navigate('/rooms');
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
                        name="name"
                        required
                        value={roomData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        required
                        value={roomData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="content"
                        required
                        value={roomData.content}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select
                        name="type"
                        required
                        value={roomData.type}
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
                            const imageUrl = image.type === 'LOCAL' || image.hotelImgUri.startsWith('/local')
                                ? `http://localhost:8888${image.hotelImgUri.replace('/local', '/hotel/images')}`
                                : image.hotelImgUri;
                            console.log(`Generated Image URL for ${image.type}: ${imageUrl}`); // 이미지 URL 확인

                            return (
                                <div key={index} className={styles.imageContainer}>
                                    <img
                                        src={imageUrl}
                                        alt={`${roomData.name} 이미지`}
                                        className={styles.image}
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
