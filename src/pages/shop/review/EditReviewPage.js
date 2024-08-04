import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Review.module.scss';
import RatingInput from './RatingInput'; // 새로 만든 RatingInput 컴포넌트 import

const EditReviewPage = () => {
  const { reviewId } = useParams();
  const [reviewContent, setReviewContent] = useState('');
  const [rate, setRate] = useState(5);
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
        setReviewContent(data.reviewContent);
        setRate(data.rate);
      } catch (error) {
        console.error('리뷰 조회 오류:', error);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8888/shop/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewContent,
          rate,
          user: { id: 'dummy-user-id' }, // 실제 user_id로 변경 필요
          treats: { id: 'dummy-treats-id' }, // 실제 treats_id로 변경 필요
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`네트워크 응답이 실패했습니다. 오류: ${errorData.message}`);
      }

      console.log('리뷰 수정 성공');
      navigate('/review-page');
    } catch (error) {
      console.error('리뷰 수정 오류:', error);
      console.log('리뷰 수정 실패:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8888/shop/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('네트워크 응답이 실패했습니다.');
      }

      console.log('리뷰 삭제 성공');
      navigate('/review-page');
    } catch (error) {
      console.error('리뷰 삭제 오류:', error);
      console.log('리뷰 삭제 실패:', error.message);
    }
  };

  return (
    <div className={`${styles.review_common_box} ${styles.review_editor_box}`}>
      <h1>리뷰 수정하기</h1>
      <p> 닉네임 : {user.nickname} </p> 
      <p> 이메일 : {user.email} </p> 
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="review">리뷰</label>
          <textarea
            id="review"
            className={styles.review_text}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="rate">별점</label>
          <RatingInput value={rate} onChange={setRate} />
        </div>
        <button type="submit">수정하기</button>
      </form>
      <button onClick={handleDelete}>삭제하기</button>
    </div>
  );
};

export default EditReviewPage;
