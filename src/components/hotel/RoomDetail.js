import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Slider from "react-slick";
import styles from './RoomDetail.module.scss';

const RoomDetail = ({hotel}) => {
    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
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
        <div className={styles.roomDetail}>
            {hotel.room.map((room) => (
                <div key={room['room-id']} className={styles.room}>
                    <Slider className={styles.slider} {...sliderSettings}>
                        {room["room-images"] && room["room-images"].map((image, index) => {
                            const imageUrl = getImageUrl(image['image-uri']);
                            if (!imageUrl) {
                                console.error('Invalid image URI for image', image);
                                return null;
                            }
                            return (
                                <div key={image['image-id'] || index} className={styles.slide}>
                                    <img src={imageUrl} alt={`${room.name} - ${image['image-uri']}`}/>
                                </div>
                            );
                        })}
                    </Slider>
                    <h2>{room.name}</h2>
                    <p>{room.content}</p>
                    <p>Type: {room.type}</p>
                    <p>Price: {room.price}</p>
                </div>
            ))}
        </div>
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
};

export default RoomDetail;
