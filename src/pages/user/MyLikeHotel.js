import React, { useEffect } from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeHotel.module.scss';
import { useDispatch, useSelector } from "react-redux";
import {addFavorite, fetchFavorites, removeFavorite} from "../../components/store/hotel/FavoriteSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark as filledBookmark} from "@fortawesome/free-solid-svg-icons";
import {faBookmark as emptyBookmark} from "@fortawesome/free-regular-svg-icons";

const MyLikeHotel = () => {
    const { favorites, status } = useSelector(state => state.favorites);
    const dispatch = useDispatch();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    console.log("user", userDetail)

    useEffect(() => {
        if (userDetail && userDetail.id) {
            dispatch(fetchFavorites(userDetail.userId));
        }
    }, [dispatch, userDetail.id]);

    console.log("favorites", favorites)

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error: Could not load favorites.</div>;
    }

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };


    // 호텔이 즐겨찾기 목록에 있는지 확인
    const isFavorite = (hotelId) => favorites.some(fav => fav.hotelId === hotelId);

    // 호텔 즐겨찾기 추가
    const handleAddFavorite = (hotelId) => {
        dispatch(addFavorite(hotelId));
    };

    // 호텔 즐겨찾기 제거
    const handleRemoveFavorite = (hotelId) => {
        dispatch(removeFavorite(hotelId));
    };


    return (
        <div>
            <MyPageHeader />
            <div>
                <h1>내가 찜한 호텔</h1>
                {favorites.length > 0 ? (
                    <div>
                        {favorites.map(hotel => (
                            <div key={hotel.hotelId}>
                                <button
                                    onClick={() => isFavorite(hotel.hotelId) ? handleRemoveFavorite(hotel.hotelId) : handleAddFavorite(hotel.hotelId)}
                                    className={styles.favoriteButton}
                                >
                                    <FontAwesomeIcon icon={isFavorite(hotel.hotelId) ? filledBookmark : emptyBookmark}/>
                                </button>
                                <div className={styles.hotelInfo}>
                                    <h3>호텔 이름: {hotel.hotelName}</h3>
                                    <p>호텔 위치: {hotel.location}</p>
                                </div>
                                {hotel["hotel-images"] && hotel["hotel-images"][0] && (
                                    <img
                                        src={getImageUrl(hotel["hotel-images"][0].hotelImgUri)}
                                        alt={`${hotel.hotelName} 이미지`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>찜한 호텔이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyLikeHotel;
