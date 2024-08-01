import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './HotelList.module.scss';
import { userEditActions } from '../store/user/UserEditSlice';
import {addFavorite, fetchFavorites, removeFavorite} from '../store/hotel/FavoriteSlice';

const HotelList = ({ hotels, onShowProperty }) => {
    const userData = useRouteLoaderData('user-data');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const favorites = useSelector((state) => state.favorites.favorites);


    useEffect(() => {
        if (userData) {
            dispatch(userEditActions.updateUserDetail(userData));
        }
    }, [dispatch, userData]);

    const handleAddRoom = (hotelId) => {
        navigate(`/add-room/${hotelId}`);
    };

    const handleAddReview = (hotelId) => {
        if (userDetail && userDetail.userId) {
            navigate(`/add-review/${hotelId}`, { state: { userId: userDetail.userId } });
        } else {
            console.error('사용자 ID가 누락되었습니다');
        }
    };

    // 호텔이 즐겨찾기 목록에 있는지 확인
    const isFavorite = (hotelId) => favorites.some(fav => fav.hotelId === hotelId);

    useEffect(() => {
        if (userDetail && userDetail.userId) {
            dispatch(fetchFavorites(userDetail.userId));
        }
    }, [dispatch, userDetail.userId]);


    // 즐겨찾기 상태를 업데이트.
    useEffect(() => {
        if (userData) {
            dispatch(userEditActions.updateUserDetail(userData));

        }
    }, [dispatch, userData]);

    // 호텔 즐겨찾기 추가
    const handleAddFavorite = (hotelId) => {
        dispatch(addFavorite(hotelId));
    };

    // 호텔 즐겨찾기 제거
    const handleRemoveFavorite = (hotelId) => {
        dispatch(removeFavorite(hotelId));
    };

    return (
        <div className={styles.hotelList}>
            {hotels.map((hotel) => (
                <div key={hotel.id} className={styles.hotel}>
                    <div className={styles.imageBox}>
                        <div className={styles.imageGallery}>
                            {hotel["hotel-images"] && hotel["hotel-images"].map(image => {
                                const imageUrl = `http://localhost:8888${image.hotelImgUri.replace('/local', '/hotel/images')}`;
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
                    {isFavorite(hotel.id) ? (
                        <button onClick={() => handleRemoveFavorite(hotel.id)}>즐겨찾기 제거</button>
                    ) : (
                        <button onClick={() => handleAddFavorite(hotel.id)}>즐겨찾기 추가</button>
                    )}

                    <button className={styles.ListButton} onClick={() => handleAddReview(hotel.id)}>Write Review
                    </button>
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

