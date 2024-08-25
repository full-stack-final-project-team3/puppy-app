import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';
import { SHOP_URL } from '../../../config/user/host-config';
import { REVIEW_URL } from "../../../config/user/host-config";

const ReviewDetailPage = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`${SHOP_URL}/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        const data = await response.json();
        //console.log('Fetched review data:', data);
        setReview(data);
      } catch (error) {
        //console.error('리뷰 조회 오류:', error);
      }
    };

    fetchReview();
  }, [reviewId]);

  if (!review) {
    return <div>로딩 중...</div>;
  }

  const handleEditClick = () => {
    navigate(`/review-page/edit-review/${reviewId}`);
  };

  // 사용자 ID와 리뷰 작성자 ID를 비교
  const isAuthor = user.id === review.user.id;

  return (
    <div className={`${styles.review_common_box} ${styles.review_detail_box}`}>
      <h1>리뷰 상세 보기</h1>
      <div>
        <p>프로필 이미지</p>
        <img className={styles.image} src={user.profileUrl} alt="Profile" />
      </div>
      <p>닉네임: {user.nickname}</p>
      <p>이메일: {user.email}</p>
      <div>
        <h2>{review.reviewContent}</h2>
        <Rating name="read-only" value={review.rate} readOnly precision={0.5} />
        {review.user && (
          <p>작성자: {review.user.nickname} / 이메일: {review.user.email}</p>
        )}
        <p>작성 일자: {new Date(review.createdAt).toLocaleString()}</p>
        {review.reviewPics && review.reviewPics.map((pic, index) => {
          const imageUrl = `${SHOP_URL}/review-img/${pic.reviewPic}`;
          return (
            <img 
              key={index} 
              src={`${REVIEW_URL}/review-img/${pic.reviewPic}`} 
              alt={`Review Pic ${index + 1}`} 
              className={styles.review_image} 
            />
            // <img key={index} src={imageUrl} alt={`Review Pic ${index + 1}`} className={styles.review_image} />
          );
        })}
      </div>
      {isAuthor && (
        <button onClick={handleEditClick}>수정하기</button>
      )}
      <button onClick={() => navigate('/review-page')}>리뷰 목록으로 돌아가기</button>
    </div>
  );
};

export default ReviewDetailPage;
