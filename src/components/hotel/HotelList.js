import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from './HotelList.module.scss';

const HotelList = ({ hotels, onShowProperty  }) => {
    const navigate = useNavigate();

    const handleAddRoom = (hotelId) => {
        navigate(`/add-room/${hotelId}`);
    };

    console.log('HotelList rendered with hotels:', hotels);
    return (
        <div className={styles.hotelList}>
            {hotels.map(hotel => (
                <div key={hotel.id} className={styles.hotel}>
                  <div className={styles.imageBox}>
                    <div className={styles.imageGallery}>
                        {hotel["hotel-images"] && hotel["hotel-images"].map(image => {
                            const imageUrl = `http://localhost:8888${image.hotelImgUri.replace('/local', '/hotel/images')}`;
                            console.log(`Loading image from URL: ${imageUrl}`);
                            return (
                                <img
                                    key={image.imageId}
                                    src={imageUrl}
                                    alt={`${hotel.name} 이미지`}
                                    className={styles.image}
                                />
                            );
                        })}
                      </div>
                    </div>
                    <h2>{hotel.name}</h2>
                    <p>{hotel.description}</p>
                    <p>{hotel.location}</p>
                    <p>{hotel.phoneNumber}</p>
                    
                    <button className={styles.AddRoomButton} onClick={() => handleAddRoom(hotel.id)}>Add Room</button>
                    <button 
            className={styles.showPropertyButton} 
            onClick={() => onShowProperty(hotel.id)}
          >
            Show Property
          </button>
                </div>
            ))}
        </div>
    );
};

HotelList.propTypes = {
    hotels: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            phoneNumber: PropTypes.string.isRequired,
            "hotel-images": PropTypes.arrayOf(
                PropTypes.shape({
                    imageId: PropTypes.string.isRequired,
                    hotelImgUri: PropTypes.string.isRequired,
                    type: PropTypes.string.isRequired,
                })
            ),
        })
    ).isRequired,
};

export default HotelList;
