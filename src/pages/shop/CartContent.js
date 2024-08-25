import React, { useState } from "react";
import { getUserToken } from "../../config/user/auth";
import styles from "./ShowCart.module.scss";
import { AUTH_URL } from "../../config/user/host-config";
import { CART_URL } from "../../config/user/host-config";
import { useNavigate } from "react-router-dom"; // yj추가

const CartContent = ({
  cart,
  bundles,
  handleRemoveBundle,
  handleRemoveCart,
}) => {
  const discountedPrice = 79000; // 단일 번들 할인 전 가격
  const totalDiscountedPrice = discountedPrice * bundles.length; // 할인된 총 가격
  const token = getUserToken();
  const navigate = useNavigate(); // yj추가

  // 각 번들에 대한 구독 기간 상태 관리
  const [subscriptionPeriods, setSubscriptionPeriods] = useState(
    bundles.reduce((acc, bundle) => {
      acc[bundle.id] = ""; // 초기값은 빈 문자열
      return acc;
    }, {})
  );

  const handleSubscriptionChange = (bundleId, event) => {
    setSubscriptionPeriods((prev) => ({
      ...prev,
      [bundleId]: event.target.value,
    }));
  };

  const handleUpdateCart = async () => {
    // 구독 기간이 설정되지 않은 경우 체크
    const hasSubscription = bundles.every(
      (bundle) => subscriptionPeriods[bundle.id] !== ""
    );

    if (!hasSubscription) {
      alert("구독 기간을 설정해주세요.");
      return; // 업데이트를 중단
    }

    const updatedCartInfo = {
      bundles: bundles.map((bundle) => ({
        bundleId: bundle.id,
        subsType: subscriptionPeriods[bundle.id],
      })),
    };

    try {
      // 장바구니 정보 업데이트 요청
      await fetch(`${CART_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCartInfo),
      });

      // yj추가
      // OrderPage로 이동하면서 데이터 전달
      navigate("/order-page", {
        state: {
          cartId: cart.id,
          bundles,
          subscriptionPeriods,
          totalPrice: cart.totalPrice,
        },
      });

    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className={styles.cartList}>
      {bundles.map((bundle) => (
        <div key={bundle.id} className={styles.bundleContainer}>
          <div className={styles.bundleHeaderContainer}>
            <h4 className={styles.bundleHeader}>
              강아지 맞춤형 펫 푸드 패키지 For {bundle.dogName}
            </h4>
            <select
              className={styles.subscriptionSelect}
              value={subscriptionPeriods[bundle.id] || ""}
              onChange={(event) => handleSubscriptionChange(bundle.id, event)}
            >
              <option value="" disabled>
                - [필수] 구독 기간 -
              </option>
              <option value="ONE">1개월</option>
              <option value="MONTH3">3개월</option>
              <option value="MONTH6">6개월</option>
            </select>
          </div>
          <div className={styles.treatsList}>
            {bundle.treats.map((treat) => (
              <div key={treat.id} className={styles.treatItem}>
                {/* 간식 이미지 렌더링 */}
                {treat.treatsPics.length > 0 && (
                  <img
                    src={`${AUTH_URL}${treat.treatsPics[0].treatsPic.replace(
                      "/local",
                      "/treats/images"
                    )}`}
                    alt={treat.treatsTitle}
                    className={styles.treatImage}
                  />
                )}
                <h5 className={styles.itemTitle}>{treat.treatsTitle}</h5>
              </div>
            ))}
          </div>
          <div className={styles.bundleFooter}>
            <span className={styles.bundlePrice}>
              판매가: {bundle.bundlePrice.toLocaleString()}원
            </span>
            <span
              className={styles.itemRemove}
              onClick={() => handleRemoveBundle(bundle.id)}
            >
              삭제
            </span>
          </div>
        </div>
      ))}
      <div className={styles.clearCartContainer}>
        <button
          className={styles.clearCartButton}
          onClick={() => handleRemoveCart(cart.id)}
        >
          장바구니 비우기
        </button>
      </div>
      {/* 총 가격 영역 */}
      <div className={styles.totalPriceContainer}>
        <div className={styles.priceRow}>
          <span>총 상품금액</span>
          <span>{cart.totalPrice.toLocaleString()}원</span>
        </div>
        <div className={styles.totalAmountRow}>
          <span>결제예정금액</span>
          <span>
            <span className={styles.totalDisCount}>
              {totalDiscountedPrice.toLocaleString()}원
            </span>
            = {cart.totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className={styles.paymentButtonContainer}>
        <button className={styles.paymentButton} onClick={handleUpdateCart}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default CartContent;
