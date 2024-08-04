import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RatingInput from './RatingInput';
import styles from './Review.module.scss';
import { userEditActions } from "../../../components/store/user/UserEditSlice";
import { NOTICE_URL } from "../../../config/user/host-config"

const WriteReviewPage = () => {
  const [reviewContent, setReviewContent] = useState('');
  const [rate, setRate] = useState(5);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);
  const dispatch = useDispatch();

  const treatsId = 'b1c2d3e4-f5g6-7890-ab12-c3d4e5f67891'; // 실제 treatsId 값

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reviewContent.trim()) {
      alert('리뷰를 작성해 주세요.');
      return;
    }

    if (rate === 0) {
      alert('별점을 입력해 주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8888/shop/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewContent,
          rate,
          userId: user.id, // Redux에서 가져온 user id
          treatsId: treatsId // 실제 treatsId 값 설정
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('응답 상태 코드:', response.status);
        console.error('응답 상태 텍스트:', response.statusText);
        console.error('서버 응답 내용:', errorText);
        throw new Error('네트워크 응답이 실패했습니다.');
      }

      console.log('리뷰 제출 성공');
      const noticePayload = {
        userId: user.id,
        message: `리뷰가 성공적으로 등록되었습니다.`
      };

      try {
        const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noticePayload)
        });

        if (!noticeResponse.ok) {
          const noticeErrorText = await noticeResponse.text();
          console.error('알림 등록 실패:', noticeErrorText);
          throw new Error('알림 등록 실패');
        }

        const noticeResponseText = await noticeResponse.text();
        console.log(noticeResponseText);

        const newNotice = JSON.parse(noticeResponseText);
        dispatch(userEditActions.addUserNotice(newNotice));
        const updatedUserDetailWithNoticeCount = {
          ...user,
          noticeCount: user.noticeCount + 1
        };
        dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));

        navigate('/review-page');
      } catch (error) {
        console.error('알림 등록 오류:', error);
      }
    } catch (error) {
      console.error('리뷰 제출 오류:', error);
    }
  };

  return (
      <div className={`${styles.review_common_box} ${styles.review_writer_box}`}>
        <h1>리뷰 작성하기</h1>
        <p>닉네임: {user.nickname}</p>
        <p>이메일: {user.email}</p>
        <p>Treats ID: {treatsId}</p> {/* 실제 Treats ID 값 표시 */}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">작성하기</button>
        </form>
      </div>
  );
};

export default WriteReviewPage;