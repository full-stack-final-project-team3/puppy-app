import React, { useEffect } from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeHotel.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../components/store/hotel/FavoriteSlice";

const MyLikeHotel = () => {
    const { favorites, status } = useSelector(state => state.favorites);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

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

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1>내가 찜한 호텔</h1>
                {favorites.length > 0 ? (
                    <div className={styles.favoriteList}>
                        {favorites.map(hotel => (
                            <div key={hotel.hotelId} className={styles.favoriteItem}>
                                <div className={styles.hotelInfo}>
                                    <h3>호텔 이름: {hotel.hotelName}</h3>
                                    <p>호텔 위치: {hotel.location}</p>
                                </div>
                                {hotel["hotel-images"] && hotel["hotel-images"][0] && (
                                    <img
                                        src={getImageUrl(hotel["hotel-images"][0].hotelImgUri)}
                                        alt={`${hotel.hotelName} 이미지`}
                                        className={styles.image}
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
