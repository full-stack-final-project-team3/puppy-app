import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './HotelList.module.scss';
import { userEditActions } from '../store/user/UserEditSlice';

const HotelList = ({ hotels, onShowProperty }) => {
    const userData = useRouteLoaderData('user-data');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetail = useSelector((state) => state.userEdit.userDetail);

    useEffect(() => {
        console.log('Fetched userData:', userData);
        if (userData) {
            dispatch(userEditActions.updateUserDetail(userData));
            console.log('Dispatched userDetail:', userData);
        }
    }, [dispatch, userData]);

    useEffect(() => {
        console.log("현재 userDetail 상태:", userDetail);
    }, [userDetail]);

    const handleAddRoom = (hotelId) => {
        navigate(`/add-room/${hotelId}`);
    };

    const handleAddReview = (hotelId) => {
        if (userDetail && userDetail.userId) {
            navigate(`/add-review/${hotelId}`, { state: { userId: userDetail.userId } });
            console.log('Navigating to add review with userId:', userDetail.userId);
        } else {
            console.error('사용자 ID가 누락되었습니다');
        }
    };

    console.log('HotelList rendered with hotels:', hotels);

    return (
        <div className={styles.hotelList}>
            {hotels.map((hotel) => (
                <div key={hotel.id} className={styles.hotel}>
                  <div className={styles.imageBox}>
                    <div className={styles.imageGallery}>
                        {hotel["hotel-images"] && hotel["hotel-images"].map(image => {
                            const imageUrl = `http://localhost:8888${image.hotelImgUri.replace('/local', '/hotel/images')}`;
                            // console.log(`Loading image from URL: ${imageUrl}`);
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
                    <button className={styles.ListButton}onClick={() => handleAddReview(hotel.id)}>Write Review</button>
                    <button className={styles.ListButton} onClick={() => handleAddRoom(hotel.id)}>Add Room</button>
                    <button 
            className={styles.ListButton} 
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
            'hotel-images': PropTypes.arrayOf(
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

