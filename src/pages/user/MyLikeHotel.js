import React, { useEffect } from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeHotel.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, fetchFavorites, removeFavorite } from "../../components/store/hotel/FavoriteSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import {AUTH_URL} from "../../config/user/host-config";
import Footer from '../../layout/user/Footer';

const MyLikeHotel = () => {
    const { favorites, status } = useSelector(state => state.favorites);
    const dispatch = useDispatch();
    const userDetail = useSelector((state) => state.userEdit.userDetail);



    useEffect(() => {
        if (userDetail && userDetail.id) {
            dispatch(fetchFavorites(userDetail.userId));
        }
    }, [dispatch, userDetail.id]);

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `${AUTH_URL}${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    const isFavorite = (hotelId) => favorites.some(fav => fav.hotelId === hotelId);

    const handleAddFavorite = (hotelId) => {
        dispatch(addFavorite(hotelId));
    };

    const handleRemoveFavorite = (hotelId) => {
        dispatch(removeFavorite(hotelId));
    };

   


    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error: Could not load favorites.</div>;
    }

    return (
        <>
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1 className={styles.title}>내가 찜한 호텔</h1>
                {favorites.length > 0 ? (
                    <ul className={styles.hotelList}>
                        {favorites.map(hotel => (
                            <li key={hotel.hotelId} className={styles.hotelItem}>
                                <button
                                    onClick={() => isFavorite(hotel.hotelId) ? handleRemoveFavorite(hotel.hotelId) : handleAddFavorite(hotel.hotelId)}
                                    className={styles.favoriteButton}
                                >
                                    <FontAwesomeIcon icon={isFavorite(hotel.hotelId) ? filledBookmark : emptyBookmark} />
                                </button>
                                <div className={styles.hotelInfo}>
                                    <h3>{hotel.hotelName}</h3>
                                    <p>{hotel.location}</p>
                                </div>
                                {hotel["hotel-images"] && hotel["hotel-images"][0] && (
                                    <img
                                        src={getImageUrl(hotel["hotel-images"][0].hotelImgUri)}
                                        alt={`${hotel.hotelName} 이미지`}
                                        className={styles.hotelImage}
                                        
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noHotel}>찜한 호텔이 없습니다.</p>
                )}
            </div>
        </div>
            
        <Footer />

        </>
    );
};

export default MyLikeHotel;