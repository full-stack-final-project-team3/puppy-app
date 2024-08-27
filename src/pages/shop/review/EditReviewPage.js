import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';
import { REVIEW_URL } from "../../../config/user/host-config";

const EditReviewPage = ({ reviewId, onClose, onReviewDeleted }) => { // onReviewDeleted prop 추가
  const [reviewContent, setReviewContent] = useState('');
  const [rate, setRate] = useState(5);
  const [reviewPics, setReviewPics] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`${REVIEW_URL}/${reviewId}`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        const data = await response.json();
        setReviewContent(data.reviewContent);
        setRate(data.rate);
        setReviewPics(data.reviewPics || []);
      } catch (error) {
        //console.error('리뷰 조회 오류:', error);
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

      const response = await fetch(`${REVIEW_URL}/${reviewId}`, {
        method: 'PUT',
        headers: {
          'userId': user.id
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        //console.error('서버 응답 오류:', errorData);
        throw new Error(`네트워크 응답이 실패했습니다. 오류: ${errorData.message}`);
      }

      //console.log('리뷰 수정 성공');
      window.location.reload();
    } catch (error) {
      //console.error('리뷰 수정 오류:', error);
      //console.log('리뷰 수정 실패:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${REVIEW_URL}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'userId': user.id
        }
      });

      if (!response.ok) {
        throw new Error('리뷰 삭제에 실패했습니다.');
      }

      //console.log('리뷰 삭제 성공');
      onClose(); // 모달 닫기
      onReviewDeleted(reviewId); // 삭제 후 상태 갱신을 위한 콜백 호출
    } catch (error) {
      //console.error('리뷰 삭제 오류:', error);
    }
  };

  return (
    <>
      <div className={`${styles.review_common_box} ${styles.review_editor_box}`}>
        <h1>리뷰 수정하기</h1>
        <form onSubmit={handleUpdate}>
          <div>
            <textarea
              id="review"
              className={styles.review_text}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.rating_input_wrapper}>
            <Rating
              name="editable-rate"
              value={rate}
              onChange={(e, newValue) => setRate(newValue)}
              precision={1}
            />
          </div>
          <div className={styles.file_input_wrapper}>
            <label htmlFor="reviewPics">이미지 선택</label>
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
                src={`${REVIEW_URL}/review-img/${pic.reviewPic}`}
                alt={`Review Pic ${index + 1}`}
                className={styles.review_image}
              />
            ))}
          </div>

          <div className={styles.button_container}> {/* 버튼을 감싸는 div 추가 */}
            <button type="submit" onClick={handleDelete} className={styles.delete_button}>삭제하기</button>
            <button type="submit" className={styles.submit_button}>수정하기</button>
            <button type="button" className={styles.close_button} onClick={onClose}>×</button> {/* 닫기 버튼 */}
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReviewPage;
