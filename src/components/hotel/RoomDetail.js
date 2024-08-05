import React, { useEffect, useState } from 'react';
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
import { fetchAvailableRooms } from '../store/hotel/ReservationSlice';

const RoomDetail = ({ hotel, onBook, getSliderSettings, onModifyRoom }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hotelId = hotel['hotel-id'];
    const rooms = useSelector(state => state.roomAdd.rooms);
    const startDate = useSelector(state => state.reservation.startDate);
    const endDate = useSelector(state => state.reservation.endDate);

    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        if (hotel && hotel.room) {
            dispatch(setRooms(hotel.room));
        }
    }, [dispatch, hotel]);

    useEffect(() => {
        if (hotelId && startDate && endDate) {
            dispatch(fetchAvailableRooms({ city: hotelId, startDate, endDate }))
                .unwrap()
                .then(rooms => {
                    setAvailableRooms(rooms);
                })
                .catch(error => {
                    console.error("Error fetching available rooms:", error);
                });
        }
    }, [dispatch, hotelId, startDate, endDate]);

    useEffect(() => {
        setAvailableRooms(rooms);
    }, [rooms]);

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
                const updatedRooms = availableRooms.filter(room => room['room-id'] !== roomId);
                setAvailableRooms(updatedRooms);
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
                {availableRooms.map((room, roomIndex) => (
                    <div key={room['room-id']} className={styles.room}>
                        <button onClick={() => handleDeleteRoom(room['room-id'])}>Delete room</button>
                        <Slider className={styles.slider} {...getSliderSettings(room["room-images"].length)}>
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
                        <p>Type: {room['room-type']}</p>
                        <p>Price: {room['room-price']}</p>
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
                        'image-type': PropTypes.string,
                    }).isRequired
                ),
            }).isRequired
        ).isRequired,
    }).isRequired,
    onBook: PropTypes.func.isRequired,
    getSliderSettings: PropTypes.func.isRequired,
};

export default RoomDetail;
