import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';

const EditReviewPage = () => {
  const { reviewId } = useParams();
  const [reviewContent, setReviewContent] = useState('');
  const [rate, setRate] = useState(5);
  const [reviewPics, setReviewPics] = useState([]);
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
        setReviewPics(data.reviewPics || []);
      } catch (error) {
        console.error('리뷰 조회 오류:', error);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleFileChange = (event) => {
    setReviewPics(Array.from(event.target.files));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('reviewSaveDto', new Blob([JSON.stringify({
        reviewContent,
        rate,
        userId: user.id,
        treatsId: 'dummy-treats-id' // 실제 treatsId로 변경 필요
      })], { type: 'application/json' }));

      reviewPics.forEach((pic, index) => {
        formData.append('reviewPics', pic);
      });

      const response = await fetch(`http://localhost:8888/shop/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'userId': user.id
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('서버 응답 오류:', errorData);
        throw new Error(`네트워크 응답이 실패했습니다. 오류: ${errorData.message}`);
      }

      console.log('리뷰 수정 성공');
      navigate('/review-page');
    } catch (error) {
      console.error('리뷰 수정 오류:', error);
      console.log('리뷰 수정 실패:', error.message);
    }
  };

  return (
    <div className={`${styles.review_common_box} ${styles.review_editor_box}`}>
      <h1>리뷰 수정하기</h1>
      <p>닉네임: {user.nickname}</p>
      <p>이메일: {user.email}</p>
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
          <Rating
            name="editable-rate"
            value={rate}
            onChange={(e, newValue) => setRate(newValue)}
            precision={0.5}
          />
        </div>
        <div>
          <label htmlFor="reviewPics">이미지 업로드</label>
          <input
            type="file"
            id="reviewPics"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          {reviewPics.map((pic, index) => (
            <img
              key={index}
              src={`http://localhost:8888/shop/reviews/review-img/${pic.reviewPic}`}
              alt={`Review Pic ${index + 1}`}
              className={styles.review_image}
            />
          ))}
        </div>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default EditReviewPage;
