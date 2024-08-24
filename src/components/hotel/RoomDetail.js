import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {motion} from 'framer-motion';
import Slider from "react-slick";
import styles from './RoomDetail.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useDispatch, useSelector} from 'react-redux';
import ReviewList from './ReviewList';
import {useNavigate} from "react-router-dom";
import MapView from './MapView';
import {deleteRoom, setRooms} from '../store/hotel/RoomAddSlice';
import {fetchAvailableRooms} from '../store/hotel/ReservationSlice';
import Footer from '../../layout/user/Footer';
import {AUTH_URL} from "../../config/user/host-config"


const RoomDetail = ({hotel, onBook, getSliderSettings, onModifyRoom}) => {

    const roomTypeMapping = {
        SMALL_DOG: "소형견",
        MEDIUM_DOG: "중형견",
        LARGE_DOG: "대형견"
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hotelId = hotel['hotel-id'];
    const rooms = useSelector(state => state.roomAdd.rooms);
    const startDate = useSelector(state => state.reservation.startDate);
    const endDate = useSelector(state => state.reservation.endDate);
    const userData = useSelector((state) => state.userEdit.userDetail);
    const isAdmin = userData && userData.role === 'ADMIN';

    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        if (hotel && hotel.room) {
            dispatch(setRooms(hotel.room));
        }
    }, [dispatch, hotel]);

    useEffect(() => {
        if (hotelId && startDate && endDate) {
            dispatch(fetchAvailableRooms({city: hotelId, startDate, endDate}))
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
        return <p>해당 날짜에 예약이 다 차있습니다!</p>;
    }

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `${AUTH_URL}${imageUri.replace('/local', '/hotel/images')}`;
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
        // eslint-disable-next-line no-restricted-globals
        if (confirm("정말로 이 방을 삭제하시겠습니까?")) {
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
        }
    };

    const animateProps = {
        initial: {opacity: 0, y: 50},
        whileInView: {opacity: 1, y: 0},
        viewport: {once: false},
        transition: {ease: "easeInOut", duration: 1, y: {duration: 0.5}}
    };

    return (
        <>
            {isAdmin && (<button className={styles.modifyButton} onClick={modifyHotelHandler}>
                Modify Hotel
            </button>)}
            <div className={styles.roomDetail}>
                {availableRooms.length === 0 ? (
                    <div className={styles.noRoomsMessage}>
                        <p>해당 날짜에 예약이 다 차있습니다!</p>
                        <img src="/pawpaw.png" alt="No results found" className={styles.noRoomImage}/>
                    </div>
                ) : (
                    availableRooms.map((room, roomIndex) => (
                        <div key={room['room-id']} className={styles.room}>
                            {isAdmin && (
                                <button className={styles.deleteButton}
                                        onClick={() => handleDeleteRoom(room['room-id'])}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            )}

                            <Slider className={styles.slider} {...getSliderSettings(room["room-images"].length)}>
                                {room["room-images"] && room["room-images"].map((image, imageIndex) => {
                                    const imageUrl = getImageUrl(image['hotelImgUri']);
                                    if (!imageUrl) {
                                        console.error('Invalid image URI for image', image);
                                        return null;
                                    }
                                    return (
                                        <div key={image['image-id'] || `${roomIndex}-${imageIndex}`}
                                             className={styles.slide}>
                                            <img src={imageUrl} alt={`${room.name} - ${image['hotelImgUri']}`}/>
                                        </div>
                                    );
                                })}
                            </Slider>
                            <h2>{room['room_name']}</h2>
                            <p>{room['room-content']}</p>
                            <p>Type: {roomTypeMapping[room['room-type']]}</p>
                            <p>Price: ₩{room['room-price']}</p>
                            <button className={styles.booknow} onClick={() => onBook(hotel, room)}>Book now</button>
                        </div>
                    ))
                )}
            </div>
            <div className={styles.titleReview}>Review</div>
            <motion.div {...animateProps} className={styles.review}>
                <ReviewList hotelId={hotelId}/>
            </motion.div>
            <motion.div {...animateProps} className={styles.line}></motion.div>
            <motion.div {...animateProps}>
                <div className={styles.instruction}>
                    <div className={styles.hotelTitle}>
                        {hotel['hotel-name']}
                    </div>
                    <div className={styles.description}>
                        {hotel['description']}
                    </div>
                </div>
            </motion.div>
            <motion.div {...animateProps} className={styles.line}></motion.div>
            <motion.div {...animateProps} className={styles.location}>
                <MapView location={hotel['location']} title={hotel['hotel-name']}/>
                <motion.div {...animateProps} className={styles.contact}>
                    <h1 className={styles.contactTitle}>Location</h1>
                    {hotel['location']}<br></br><br></br>
                    Contact : {hotel['phone-number']}&nbsp;&nbsp;&nbsp;&nbsp;
                </motion.div>
            </motion.div>
            <Footer/>
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
