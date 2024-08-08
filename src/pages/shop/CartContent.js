import React from "react";
import styles from "./ShowCart.module.scss";
import { AUTH_URL } from "../../config/user/host-config";

const CartContent = ({
  cart,
  bundles,
  handleRemoveBundle,
  handleRemoveCart,
}) => {
  const discountedPrice = 69000; // 단일 번들 할인 전 가격
  const totalDiscountedPrice = discountedPrice * bundles.length; // 할인된 총 가격

  return (
    <div className={styles.cartList}>
      {bundles.map((bundle) => (
        <div key={bundle.id} className={styles.bundleContainer}>
          <h4 className={styles.bundleHeader}>
            {bundle.dogName}을 위한 맞춤 패키지
          </h4>
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
        <button className={styles.paymentButton}>결제하기</button>
      </div>
    </div>
  );
};

export default CartContent;
