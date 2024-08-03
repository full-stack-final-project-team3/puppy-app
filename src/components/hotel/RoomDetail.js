import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";
import styles from './RoomDetail.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from 'react-redux';
import ReviewList from './ReviewList';
import { useNavigate } from "react-router-dom";
import MapView from './MapView';
import { deleteRoom, setRooms } from '../store/hotel/RoomAddSlice';
import store from "../store";

const RoomDetail = ({ hotel, onBook, sliderSettings, onModifyRoom }) => {
    console.log('hotelid: ' ,hotel['hotel-id']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hotelId = hotel['hotel-id'];
    const rooms = useSelector(state => state.roomAdd.rooms);

    useEffect(() => {
        if (hotel && hotel.room) {
            dispatch(setRooms(hotel.room));
        }
    }, [dispatch, hotel]);

    if (!hotel || !rooms.length) {
        return <p>No rooms available</p>;
    }

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    const modifyHotelHandler = () => {
        if (hotel && hotelId) {
            navigate(`/modify-hotel/${hotelId}`);
        } else {
            console.log("Hotel ID is undefined");
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            const actionResult = await dispatch(deleteRoom(roomId));
            if (actionResult.type.endsWith('fulfilled')) {
                const currentRooms = store.getState().roomAdd.rooms;
                const updatedRooms = currentRooms.filter(room => room['room-id'] !== roomId);
                dispatch(setRooms(updatedRooms));
            }
        } catch (e) {
            console.error("룸 삭제 실패", e);
        }
    };

    return (
        <>
            <button onClick={modifyHotelHandler}>호텔 수정하기</button>
            <div className={styles.roomDetail}>
                {rooms.map((room, roomIndex) => (
                    <div key={room['room-id']} className={styles.room}>
                        <button onClick={() => handleDeleteRoom(room['room-id'])}>Delete room</button>
                        <Slider className={styles.slider} {...sliderSettings}>
                            {room["room-images"] && room["room-images"].map((image, imageIndex) => {
                                const imageUrl = getImageUrl(image['hotelImgUri']);
                                if (!imageUrl) {
                                    console.error('Invalid image URI for image', image);
                                    return null;
                                }
                                return (
                                    <div key={image['image-id'] || `${roomIndex}-${imageIndex}`} className={styles.slide}>
                                        <img src={imageUrl} alt={`${room.name} - ${image['hotelImgUri']}`} />
                                    </div>
                                );
                            })}
                        </Slider>
                        <h2>{room.name}</h2>
                        <p>{room.content}</p>
                        <p>Type: {room.type}</p>
                        <p>Price: {room.price}</p>
                        <button onClick={() => onBook(hotel, room)}>Book Now</button>
                    </div>
                ))}
            </div>
            <div>
                <ReviewList hotelId={hotelId} />
            </div>
            <div>
                <div className={styles.description}>
                    Description : {hotel['description']}
                </div>
                <div className={styles.description}>
                    Contact : {hotel['phone-number']}
                </div>
            </div>
            <div className={styles.description}>
                <MapView location={hotel['location']} title={hotel['hotel-name']} />
            </div>
            <div className={styles.description}>
                주소 : {hotel['location']}
            </div>
        </>
    );
};

RoomDetail.propTypes = {
    hotel: PropTypes.shape({
        room: PropTypes.arrayOf(
            PropTypes.shape({
                'room-id': PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                "room-images": PropTypes.arrayOf(
                    PropTypes.shape({
                        'image-id': PropTypes.string,
                        'hotelImgUri': PropTypes.string.isRequired,
                        'image-type': PropTypes.string, // 선택적 속성으로 변경
                    }).isRequired
                ),
            }).isRequired
        ).isRequired,
    }).isRequired,
    onBook: PropTypes.func.isRequired,
    sliderSettings: PropTypes.object.isRequired,
};

export default RoomDetail;
