import React, { useEffect, useState } from 'react'; // React와 useEffect, useState 훅을 임포트
import { useNavigate } from 'react-router-dom'; // 페이지 네비게이션을 위한 useNavigate 훅을 임포트
import { useSelector } from 'react-redux'; // Redux 상태를 선택하기 위한 useSelector 훅을 임포트
import Rating from '@mui/material/Rating'; // Material-UI의 Rating 컴포넌트를 임포트
import styles from './Review.module.scss'; // CSS 모듈을 임포트하여 스타일 적용

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태 변수
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 navigate 함수
  const user = useSelector((state) => state.userEdit.userDetail); // Redux 상태에서 현재 사용자 정보를 선택

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 리뷰 데이터를 가져오는 함수
    const fetchReviews = async () => {
      try {
        // 리뷰 데이터를 가져오기 위해 API 호출
        const response = await fetch('http://localhost:8888/shop/reviews');
        if (!response.ok) {
          // 응답이 실패한 경우 예외 처리
          throw new Error('네트워크 응답이 실패했습니다.');
        }
        const data = await response.json(); // JSON 형식으로 응답 데이터 파싱
        setReviews(data); // 리뷰 데이터를 상태에 저장
        console.log(data);
      } catch (error) {
        // 오류 발생 시 콘솔에 로그 출력
        console.error('리뷰 조회 오류:', error);
      }
    };

    fetchReviews(); // fetchReviews 함수 호출
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 호출되도록 설정

  // 리뷰 항목 클릭 시 상세 페이지로 이동하는 함수
  const handleReviewClick = (reviewId) => {
    navigate(`/review-page/review-detail/${reviewId}`);
  };

  // 리뷰 작성 페이지로 이동하는 함수
  const handleButtonClick = () => {
    navigate('/review-page/write-review');
  };

  return (
    <div className={`${styles.review_common_box} ${styles.review_page_box}`}>
      <div>
        <h1>리뷰 목록 조회</h1> {/* 페이지 제목 */}
        <ul className={styles.review_list_box}>
          {/* reviews 배열을 순회하여 각 리뷰를 목록으로 표시 */}
          {reviews.map((review) => (
            <li key={review.id} onClick={() => handleReviewClick(review.id)}>
              <img className={styles.image} src={user.profileUrl} alt="Profile" />
              <h2>리뷰 내용 : {review.reviewContent}</h2> {/* 리뷰 내용 표시 */}
              <div>별점 : <Rating name="read-only" value={review.rate} readOnly precision={0.5} /></div>
              {/* 리뷰 평점 표시 (읽기 전용) */}
              {user && (
                <p> 닉네임 : {user.nickname} ///  이메일 : {user.email} </p>
                // 현재 사용자 정보가 존재하면 사용자 닉네임과 이메일 표시
              )}
              <p> 작성 일자 : {new Date(review.createdAt).toLocaleString()} </p> 
              {/* 리뷰 작성 일자를 읽기 좋은 형식으로 표시 */}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleButtonClick}>리뷰 작성하기</button> {/* 리뷰 작성 페이지로 이동하는 버튼 */}
    </div>
  );
};

export default ReviewPage; // 컴포넌트를 내보내기
