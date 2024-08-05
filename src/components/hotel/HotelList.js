import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useLoaderData, useNavigate, useRouteLoaderData} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styles from './HotelList.module.scss';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBookmark as filledBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as emptyBookmark } from '@fortawesome/free-regular-svg-icons';
import {userEditActions} from '../store/user/UserEditSlice';
import {addFavorite, fetchFavorites, removeFavorite} from '../store/hotel/FavoriteSlice';
import {deleteHotel, updateHotel} from "../store/hotel/HotelAddSlice";
import store from "../store";
import {setHotels} from "../store/hotel/HotelPageSlice";

const HotelList = ({onShowProperty, getSliderSettings }) => {
    const userData = useRouteLoaderData('user-data');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const favorites = useSelector((state) => state.favorites.favorites);
    const hotels = useSelector((state) => state.hotelPage.hotels);

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
            navigate(`/add-review/${hotelId}`, {state: {userId: userDetail.userId}});
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

    // 호텔 삭제 처리 함수
    // 리렌더링이 안돼서 여기서 직접 호출해와서 진행하기
    const handleDeleteHotel = async (hotelId) => {
        try {
            const actionResult = await dispatch(deleteHotel(hotelId));
            if (actionResult.type.endsWith('fulfilled')) {
                // Redux store 에서 직접 필요한 상태를 가져오는 로직
                const currentHotels = store.getState().hotelPage.hotels;
                const updatedHotels = currentHotels.filter(hotel => hotel.id !== hotelId);
                dispatch(setHotels(updatedHotels));
            }
        } catch (error) {
            console.error("호텔 삭제 실패:", error);
        }
    };

    return (
        <div className={styles.hotelList}>
            {hotels.map((hotel) => (
                <div key={hotel.id} className={styles.hotel}>
                    <button
                        onClick={() => isFavorite(hotel.id) ? handleRemoveFavorite(hotel.id) : handleAddFavorite(hotel.id)}
                        className={styles.favoriteButton}
                    >
                        <FontAwesomeIcon icon={isFavorite(hotel.id) ? filledBookmark : emptyBookmark} />
                    </button>
                    <button onClick={() => handleDeleteHotel(hotel.id)} className={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className={styles.imageBox}>
                        {/* Slider 적용 */}
                        <Slider {...getSliderSettings(hotel["hotel-images"].length)} className={styles.imageGallery}>
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
                        </Slider>
                    </div><br></br>
                    <h2>{hotel.name}</h2><br></br>
                    <p>{hotel.description}</p><br></br>
                    <p>{hotel.location}</p>

                    <button className={styles.ListButton} onClick={() => handleAddReview(hotel.id)}>리뷰 작성</button>
                    <button className={styles.ListButton} onClick={() => handleAddRoom(hotel.id)}>방 추가</button>
                    <button className={styles.ListButton} onClick={() => onShowProperty(hotel.id)}>선택</button>
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

