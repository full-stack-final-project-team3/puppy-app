import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import styles from "./SnackReview.module.scss";
import { SHOP_URL, RESOURCES_URL } from "../../config/user/host-config";
import WriteReviewPage from "../../pages/shop/review/WriteReviewPage";
import EditReviewPage from "../../pages/shop/review/EditReviewPage";
import TreatsDetailModal from "../../pages/shop/TreatsDetailModal";
import Footer from "../../layout/user/Footer";

// Modal 스타일 설정
Modal.setAppElement("#root");

const SnackReview = () => {
  const user = useSelector((state) => state.userEdit.userDetail);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedTreat, setSelectedTreat] = useState({
    reviewId: null,
    orderId: null,
    treatId: null,
    dogId: null,
    treatTitle: "",
  });
  const [visibleCount, setVisibleCount] = useState(1); // 보여지는 .card의 수를 관리하는 상태
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 로드될 때 스크롤을 맨 위로 이동
  }, []);

  useEffect(() => {
    fetchOrderHistory();
  }, [user.id, isReviewModalOpen, isEditModalOpen]);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(`${SHOP_URL}/orders/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("주문 내역을 가져오지 못했습니다.");
      }

      const data = await response.json();
      setOrderHistory(data);
    } catch (error) {
      console.error("주문 내역을 가져오지 못했습니다:", error);
    }
  };

  const openReviewModal = (orderId, treatId, dogId, treatTitle) => {
    setSelectedTreat({ orderId, treatId, dogId, treatTitle });
    setIsReviewModalOpen(true);
  };

  const openEditModal = (reviewId, orderId, treatId, treatTitle) => {
    setSelectedTreat({ reviewId, orderId, treatId, treatTitle });
    setIsEditModalOpen(true);
  };

  const openProductModal = (treatId) => {
    setSelectedTreat({ treatId });
    setIsProductModalOpen(true);

    setModalPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.09,
    });
  };

  const toggleTreatSelection = () => {
    return;
  };

  const closeModal = () => {
    setIsReviewModalOpen(false);
    setIsEditModalOpen(false);
    setIsProductModalOpen(false);
  };

  const handleReviewDeleted = (deletedReviewId) => {
    // 리뷰 삭제 시 해당 리뷰의 reviewId를 사용하여 상태를 갱신
    const updatedOrderHistory = orderHistory.map((order) => {
      return {
        ...order,
        bundles: order.bundles.map((bundle) => ({
          ...bundle,
          treats: bundle.treats.map((treat) =>
            treat.reviewId === deletedReviewId
              ? { ...treat, reviewId: null }
              : treat
          ),
        })),
      };
    });

    setOrderHistory(updatedOrderHistory);
  };

  const showMoreCards = () => {
    setVisibleCount((prevCount) => prevCount + 5); // 한 번에 한 개의 카드를 더 보여줍니다.
  };

  return (
    <>
      <div className={styles.wrap}>
        <h2 className={styles.h2}>Shop Reviews</h2>
        {orderHistory && orderHistory.length > 0 ? (
          orderHistory
            .filter((order) => order.orderStatus !== "CANCELLED")
            .slice(0, visibleCount) // visibleCount에 따라 보여줄 카드 수 제한
            .map((order, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.details}>
                    {order.bundles &&
                      order.bundles.length > 0 &&
                      order.bundles.map((bundle, bundleIndex) => (
                        <div key={bundleIndex} className={styles.bundleItem}>
                          <h3 className={styles.review_dog_name}>
                            반려견 전용 맞춤형 푸드 패키지 For{" "}
                            <span>{bundle.dogName}</span>
                          </h3>
                          <ul className={styles.snack_review_ul}>
                            {bundle.treats?.map((treat, treatIndex) => (
                              <li
                                className={styles.snack_review_li}
                                key={treatIndex}
                              >
                                <div className={styles.snack_review_box}>
                                  <img
                                    className={styles.snack_review_img_sm}
                                    src={`${RESOURCES_URL}${treat.treatUrl}`}
                                    alt="간식 이미지"
                                  />
                                </div>
                                <a
                                  onClick={() =>
                                    openProductModal(treat.treatId)
                                  }
                                >
                                  <p style={{ cursor: "pointer" }}>
                                    {treat.treatTitle}
                                  </p>
                                </a>
                                <button
                                  hidden={!!treat.reviewId}
                                  className={styles.review_button}
                                  onClick={() =>
                                    openReviewModal(
                                      order.orderId,
                                      treat.treatId,
                                      bundle.dogId,
                                      treat.treatTitle
                                    )
                                  }
                                >
                                  리뷰 작성
                                </button>
                                <button
                                  hidden={!treat.reviewId}
                                  className={`${styles.review_button} ${styles.review_button_red}`}
                                  onClick={() =>
                                    openEditModal(
                                      treat.reviewId,
                                      order.orderId,
                                      treat.treatId,
                                      treat.treatTitle
                                    )
                                  }
                                >
                                  리뷰 수정
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className={styles.noReview}>작성하신 리뷰가 없습니다.</p>
        )}
        {orderHistory.length > visibleCount && ( // 더보기 버튼 표시 조건
          <button onClick={showMoreCards} className={styles.more_button}>
            더보기
          </button>
        )}
        <Modal
          isOpen={isReviewModalOpen}
          onRequestClose={closeModal}
          contentLabel="리뷰 작성하기"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <WriteReviewPage
            orderId={selectedTreat.orderId}
            treatId={selectedTreat.treatId}
            dogId={selectedTreat.dogId}
            treatTitle={selectedTreat.treatTitle}
            onClose={closeModal} // closeModal 함수를 onClose로 전달
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeModal}
          contentLabel="리뷰 수정하기"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <EditReviewPage
            reviewId={selectedTreat.reviewId}
            orderId={selectedTreat.orderId}
            treatId={selectedTreat.treatId}
            treatTitle={selectedTreat.treatTitle}
            onClose={closeModal} // closeModal 함수를 onClose로 전달
            onReviewDeleted={handleReviewDeleted} // 리뷰 삭제 후 상태 갱신
          />
        </Modal>

        <TreatsDetailModal
          isOpen={isProductModalOpen}
          onClose={closeModal}
          treatsId={selectedTreat.treatId}
          modalPosition={modalPosition}
          toggleTreatSelection={toggleTreatSelection}
        />
      </div>
    </>
  );
};

export default SnackReview;
