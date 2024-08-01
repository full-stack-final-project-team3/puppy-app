import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";
import styles from './RoomDetail.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ReviewList from './ReviewList'; // 리뷰 리스트 컴포넌트 import
import {useNavigate} from "react-router-dom"; // 리뷰 리스트 컴포넌트 import
import MapView from './MapView';

const RoomDetail = ({hotel, onBook, sliderSettings}) => {
    
    const navigate = useNavigate()

    if (!hotel || !hotel.room || hotel.room.length === 0) {
        console.log('RoomDetail: rooms are not defined or empty', hotel);
        return <p>No rooms available</p>;
    }

    console.log('RoomDetail: rendering rooms', hotel.room);
    console.log('RoomDetail: room-images', hotel.room.flatMap(room => room["room-images"]));

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    const modifyHotelHandler = (hotelId) => {
        navigate(`/modify-hotel/${hotelId}`);
    }

    return (

        <>
            <button onClick={() => modifyHotelHandler(hotel.hotelId)}>호텔 수정하기</button>
            <div className={styles.roomDetail}>
                {hotel.room.map((room, roomIndex) => (
                    <div key={room['room-id']} className={styles.room}>
                        <Slider className={styles.slider} {...sliderSettings}>
                            {room["room-images"] && room["room-images"].map((image, imageIndex) => {
                                const imageUrl = getImageUrl(image['hotelImgUri']);
                                if (!imageUrl) {
                                    console.error('Invalid image URI for image', image);
                                    return null;
                                }
                                console.log(`Rendering image ${imageIndex}:`, imageUrl);
                                return (
                                    <div key={image['image-id'] || `${roomIndex}-${imageIndex}`}
                                         className={styles.slide}>
                                        <img src={imageUrl} alt={`${room.name} - ${image['hotelImgUri']}`}/>
                                    </div>
                                );
                            })}
                        </Slider>
                        <h2>{room.name}</h2>
                        <p>{room.content}</p>
                        <p>Type: {room.type}</p>
                        <p>Price: {room.price}</p>
                        <button onClick={() => onBook(hotel, room)}>Book Now</button>{/* hotelId와 roomId를 전달 */}
                    </div>
                ))}
            </div>
            <div>
                <ReviewList hotelId={hotel["hotel-id"]} /> {/* 리뷰 리스트 렌더링 */}
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
                <MapView 
                location={hotel['location']}
                title={hotel['hotel-name']}
                /> {/* 지도 렌더링 */}
                
            </div>
            <div 
                className={styles.description}>
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
                        'image-type': PropTypes.string.isRequired,
                    }).isRequired
                ),
            }).isRequired
        ).isRequired,
    }).isRequired,
    onBook: PropTypes.func.isRequired,
};

export default RoomDetail;
