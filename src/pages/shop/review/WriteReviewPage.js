import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RatingInput from './RatingInput';
import styles from './Review.module.scss';
import { userEditActions } from "../../../components/store/user/UserEditSlice";
import { NOTICE_URL, REVIEW_URL } from "../../../config/user/host-config";

const WriteReviewPage = ({ orderId, treatId, dogId, treatTitle, onClose }) => {
  const [reviewContent, setReviewContent] = useState('');
  const [rate, setRate] = useState(5);
  const [reviewPics, setReviewPics] = useState([{ id: Date.now(), files: [], fileNames: [] }]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);
  const dispatch = useDispatch();

  const handleFileChange = (index, event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map(file => file.name);
    setReviewPics((prevPics) =>
      prevPics.map((pic, i) => (i === index ? { ...pic, files, fileNames } : pic))
    );
  };

  const handleAddPic = () => {
    setReviewPics((prevPics) => [...prevPics, { id: Date.now(), files: [], fileNames: [] }]);
  };

  const handleRemovePic = (index) => {
    setReviewPics((prevPics) => prevPics.filter((_, i) => i !== index));
  };

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
      const formData = new FormData();
      formData.append('reviewSaveDto', new Blob([JSON.stringify({
        reviewContent,
        rate,
        userId: user.id,
        treatsId: treatId,
        orderId: orderId,
        dogId: dogId
      })], { type: "application/json" }));

      reviewPics.forEach((pic) => {
        pic.files.forEach((file) => {
          formData.append('reviewPics', file);
        });
      });

      const response = await fetch(`${REVIEW_URL}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        //console.error('응답 상태 코드:', response.status);
        //console.error('응답 상태 텍스트:', response.statusText);
        //console.error('서버 응답 내용:', errorText);
        throw new Error('네트워크 응답이 실패했습니다.');
      }

      //console.log('리뷰 제출 성공');
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
          //console.error('알림 등록 실패:', noticeErrorText);
          throw new Error('알림 등록 실패');
        }

        const noticeResponseText = await noticeResponse.text();
        //console.log(noticeResponseText);

        const newNotice = JSON.parse(noticeResponseText);
        dispatch(userEditActions.addUserNotice(newNotice));
        const updatedUserDetailWithNoticeCount = {
          ...user,
          noticeCount: user.noticeCount + 1
        };
        dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));

        // window.location.reload();
        onClose(); // 20240826: 리뷰가 성공적으로 제출이 되면 모달을 닫는거임
      } catch (error) {
        //console.error('알림 등록 오류:', error);
      }
    } catch (error) {
      //console.error('리뷰 제출 오류:', error);
    }
  };

  return (
    <>
      <div className={`${styles.review_common_box} ${styles.review_writer_box}`}>
        <h1>리뷰 작성하기</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <textarea
              id="review"
              className={styles.review_text}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="리뷰를 작성해 주세요."
            ></textarea>
          </div>
          <div className={styles.rating_input_wrapper}>
            <RatingInput value={rate} onChange={setRate} precision={1} />
          </div>
          <div>
            {reviewPics.map((pic, index) => (
              <div key={pic.id} className={styles.file_input_wrapper}>
                <label htmlFor={`file-upload-${index}`}>이미지 선택</label>
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                />
                {pic.fileNames.length > 0 && (
                  <p className={styles.file_name_list}>
                    {pic.fileNames.join(', ')}
                  </p>
                )}
                {index > 0 && (
                  <button type="button" onClick={() => handleRemovePic(index)}>제거</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddPic}>이미지 추가</button>
          </div>
          <div className={styles.button_container}>
            <button type="submit" onClick={onClose}>닫기</button> {/* onClose 함수를 연결 */}
            <button type="submit">작성하기</button>
            <button type="button" className={styles.close_button} onClick={onClose}>×</button> {/* 닫기 버튼 */}
          </div>
        </form>
      </div>
    </>
  );
};

export default WriteReviewPage;
