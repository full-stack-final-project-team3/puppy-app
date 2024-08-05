import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8888/shop/reviews');
        if (!response.ok) {
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        const data = await response.json();
        setReviews(data);
        console.log(data);
      } catch (error) {
        console.error('리뷰 조회 오류:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewClick = (reviewId) => {
    navigate(`/review-page/review-detail/${reviewId}`);
  };

  const handleButtonClick = () => {
    navigate('/review-page/write-review');
  };

  return (
    <div className={`${styles.review_common_box} ${styles.review_page_box}`}>
      <div>
        <h1>리뷰 목록 조회</h1>
        <ul className={styles.review_list_box}>
          {reviews.map((review) => (
            <li key={review.id} onClick={() => handleReviewClick(review.id)}>
              <img className={styles.image} src={review.user.profileUrl} alt="Profile" />
              <h2>리뷰 내용 : {review.reviewContent}</h2>
              <div>별점 : <Rating name="read-only" value={review.rate} readOnly precision={0.5} /></div>
              {review.user && (
                <p> 닉네임 : {review.user.nickname} /// 이메일 : {review.user.email} </p>
              )}
              <p> 작성 일자 : {new Date(review.createdAt).toLocaleString()} </p>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleButtonClick}>리뷰 작성하기</button>
    </div>
  );
};

export default ReviewPage;
