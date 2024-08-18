import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from './Review.module.scss';
import { REVIEW_URL } from "../../../config/user/host-config";

const ReviewPage = ({ treatsId }) => {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {

    console.info("ReviewPage treatId: "+ treatsId);
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${REVIEW_URL}/treats/${treatsId}`);
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
        {/* <button onClick={handleButtonClick}>리뷰 작성하기</button> */}
        <div>
          {/* <h1>리뷰 목록 조회</h1> */}
          <ul className={styles.review_list_box}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.review_item}>
                <div className={styles.review_profile_box} onClick={() => handleReviewClick(review.id)}>
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
                  {/* <p>내가 구매한 상품명 이름</p> */}
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
        </div>
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

const Modal = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_content} onClick={handleContentClick}>
        <span className={styles.close_button} onClick={onClose}>X</span>
        <div className={styles.modal_image_container}>
          <button className={styles.prev_button} onClick={onPrev}>‹</button>
          <img
            src={`http://localhost:8888/shop/reviews/review-img/${images[currentIndex].reviewPic}`}
            alt={`Review Pic ${currentIndex + 1}`}
            className={styles.modal_image}
          />
          <button className={styles.next_button} onClick={onNext}>›</button>
        </div>
      </div>
    </div>
  );
};



export default ReviewPage;
