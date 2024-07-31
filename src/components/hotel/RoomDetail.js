import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";
import styles from './RoomDetail.module.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewList from './ReviewList'; // 리뷰 리스트 컴포넌트 import

const RoomDetail = ({hotel, onBook}) => {
    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        cssEase: 'linear'
    }), []);

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

    return (

        <>
            <div className={styles.roomDetail}>
                {hotel.room.map((room, roomIndex) => (
                    <div key={room['room-id']} className={styles.room}>
                        <Slider className={styles.slider} {...sliderSettings}>
                            {room["room-images"] && room["room-images"].map((image, imageIndex) => {
                                const imageUrl = getImageUrl(image['image-uri']);
                                if (!imageUrl) {
                                    console.error('Invalid image URI for image', image);
                                    return null;
                                }
                                console.log(`Rendering image ${imageIndex}:`, imageUrl);
                                return (
                                    <div key={image['image-id'] || `${roomIndex}-${imageIndex}`}
                                         className={styles.slide}>
                                        <img src={imageUrl} alt={`${room.name} - ${image['image-uri']}`}/>
                                    </div>
                                );
                            })}
                        </Slider>
                        <h2>{room.name}</h2>
                        <p>{room.content}</p>
                        <p>Type: {room.type}</p>
                        <p>Price: {room.price}</p>
                        <button onClick={() => onBook(hotel.hotelId)}>Book Now</button>
                    </div>
                ))}
            </div>
            <div>
                <ReviewList hotelId={hotel["hotel-id"]} /> {/* 리뷰 리스트 렌더링 */}
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
                        'image-uri': PropTypes.string.isRequired,
                        'image-type': PropTypes.string.isRequired,
                    }).isRequired
                ),
            }).isRequired
        ).isRequired,
    }).isRequired,
    onBook: PropTypes.func.isRequired,
};

export default RoomDetail;
