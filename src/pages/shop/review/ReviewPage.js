import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import ReactDOM from 'react-dom'; 
import styles from './Review.module.scss';
import { REVIEW_URL } from "../../../config/user/host-config";

const ReviewPage = ({ treatsId }) => {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('latest'); // 정렬 기준 상태
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    fetchReviews();
  }, [treatsId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${REVIEW_URL}/treats/${treatsId}`);
      if (!response.ok) {
        throw new Error('네트워크 응답이 실패했습니다.');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      //console.error('리뷰 조회 오류:', error);
    }
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const sortedReviews = reviews.sort((a, b) => {
    if (sortCriteria === 'rating') {
      return b.rate - a.rate; // 별점 높은 순으로 정렬
    } else if (sortCriteria === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt); // 최신순으로 정렬
    }
    return 0;
  });

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews((prevReviews) => prevReviews.filter(review => review.id !== deletedReviewId));
  };

  const handleButtonClick = () => {
    navigate('/review-page/write-review');
  };

  const openModal = (images, index) => {
    setSelectedImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImages([]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.review_wraps_b}>
      <div className={`${styles.review_common_box} ${styles.review_page_box}`}>
        <div className={styles.review_array_box}>
          <div className={styles.review_array}>
            <a
              onClick={() => handleSortChange('rating')}
              className={sortCriteria === 'rating' ? styles.active : styles.inactive}
            >
              별점순
            </a>
            <span>｜</span>
            <a
              onClick={() => handleSortChange('latest')}
              className={sortCriteria === 'latest' ? styles.active : styles.inactive}
            >
              최신순
            </a>
          </div>
        </div>
        {reviews.length === 0 ? (
          <div className={styles.no_reviews_message}>
            작성된 리뷰가 없습니다.
          </div>
        ) : (
          <ul className={styles.review_list_box}>
            {sortedReviews.map((review) => (
              <li key={review.id} className={styles.review_item}>
                <div className={styles.review_profile_box}>
                  <div className={styles.review_left}>
                    <img className={styles.image} src={review.user.profileUrl} alt="Profile" />
                  </div>
                  <div className={styles.review_header}>
                    <p className={styles.nickname}>{review.user.nickname}</p>
                    <Rating name="read-only" value={review.rate} readOnly precision={0.5} />
                    <p className={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={styles.review_body}>
                  <div className={styles.review_images}>
                    {review.reviewPics && review.reviewPics.map((pic, index) => (
                      <img
                        key={index}
                        src={`${REVIEW_URL}/review-img/${pic.reviewPic}`}
                        alt={`Review Pic ${index + 1}`}
                        className={styles.review_image}
                        onClick={() => openModal(review.reviewPics, index)}
                      />
                    ))}
                  </div>
                  <ReviewText text={review.reviewContent} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {modalOpen && (
          <Modal
            images={selectedImages}
            currentIndex={currentImageIndex}
            onClose={closeModal}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </div>
    </div>
  );
};

const ReviewText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, []);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={styles.review_text_container}>
      <p
        ref={textRef}
        className={isExpanded ? styles.review_text_expanded : styles.review_text_collapsed}
      >
        {text}
      </p>
      {showButton && (
        <button onClick={toggleExpand} className={styles.expand_button}>
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </div>
  );
};

//20240825: 모달 컴포넌트 수정 - 포탈 사용
const Modal = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal( //20240825: 포털로 모달 렌더링
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_content} onClick={handleContentClick}>
        <span className={styles.close_button} onClick={onClose}>X</span>
        <div className={styles.modal_image_container}>
          <button className={styles.prev_button} onClick={onPrev}>‹</button>
          <img
            src={`${REVIEW_URL}/review-img/${images[currentIndex].reviewPic}`}
            alt={`Review Pic ${currentIndex + 1}`}
            className={styles.modal_image}
          />
          <button className={styles.next_button} onClick={onNext}>›</button>
        </div>
      </div>
    </div>,
    document.body //20240825: 모달을 바디 하위에 렌더링
  );
};

export default ReviewPage;
