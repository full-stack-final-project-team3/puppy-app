import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DetailAboutReservation.module.scss';
import MyPageHeader from "../auth/user/mypage/MyPageHeader";

const DetailAboutReservation = () => {
    const location = useLocation();
    const { hotel, roomName, totalPrice, reservationDate, reservationEndDate, hotelImage } = location.state || {};
    if (!hotel) {
        return <div>호텔 정보를 불러오는 중입니다...</div>;
    }

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h2>예약 상세정보</h2>
                
                {/* 호텔 이미지 렌더링 */}
                {hotelImage && (
                    <div className={styles.imageContainer}>
                        <img src={hotelImage} alt={`${hotel['hotel-name']} 이미지`} className={styles.hotelImage} />
                    </div>
                )}
                
                {/* 호텔 기본 정보 */}
                <div className={styles.hotelDetailsContainer}>
                    <div><strong>Title : </strong> {hotel['hotel-name']}</div>
                    <div><strong>Room :</strong> {roomName}</div>
                    <div className={styles.totalPrice}><strong>Total Price :</strong> {totalPrice} 원</div>
                    <div><strong>Location :</strong> {hotel['location']}</div>
                    <div className={styles.date}><strong>Check-in date :</strong> {new Date(reservationDate).toLocaleDateString()}</div>
                    <div className={styles.date}><strong>Check-out date :</strong> {new Date(reservationEndDate).toLocaleDateString()}</div>
                </div>

                {/* 호텔 설명 및 전화번호 */}
                <div className={styles.descriptionContainer}>
                    <div>{hotel['description'] || '정보 없음'}</div>
                    <div><strong>Contact :</strong> {hotel['phone-number'] || '정보 없음'}</div>
                </div>

                {/* 호텔 정책 */}
                <div className={styles.policiesContainer}>
                    <div className={styles.rules}><strong>규칙 정책 :<br></br></strong> {hotel['rules-policy'] || '정보 없음'}</div>
                    <div className={styles.cancel}><strong>취소 정책 :<br></br></strong> {hotel['cancel-policy'] || '정보 없음'}</div>
                </div>
            </div>
        </div>
    );
};

export default DetailAboutReservation;
