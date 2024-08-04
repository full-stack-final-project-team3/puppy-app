// src/components/Review/ReviewDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';

const ReviewDetailPage = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:8888/shop/reviews/${reviewId}`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        const data = await response.json();
        setReview(data);
      } catch (error) {
        console.error('리뷰 조회 오류:', error);
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

  return (
    <div className={`${styles.review_common_box} ${styles.review_detail_box}`}>
      <h1>리뷰 상세 보기</h1>
      <p> 닉네임 : {user.nickname} </p> 
      <p> 이메일 : {user.email} </p> 
      <div>
        <h2>{review.reviewContent}</h2>
        <Rating name="read-only" value={review.rate} readOnly precision={0.5} />
        {review.user && (
          <p> 닉네임 : {review.user.nickname} /// 이메일 : {review.user.email} </p>
        )}
        <p> 작성 일자 : {new Date(review.createdAt).toLocaleString()} </p>
        {review.reviewPicUrls && review.reviewPicUrls.map((url, index) => (
          <img key={index} src={url} alt={`Review Pic ${index + 1}`} className={styles.review_image} />
        ))}
      </div>
      <button onClick={handleEditClick}>수정하기</button>
      <button onClick={() => navigate('/review-page')}>리뷰 목록으로 돌아가기</button>
    </div>
  );
};

export default ReviewDetailPage;
