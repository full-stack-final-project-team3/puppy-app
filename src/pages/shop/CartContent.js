import React from "react";
import styles from "./ShowCart.module.scss";
import { AUTH_URL } from "../../config/user/host-config";

const CartContent = ({ cart, bundles, handleRemoveBundle }) => {
  return (
    <div className={styles.cartList}>
      {bundles.map((bundle) => (
        <div key={bundle.id} className={styles.bundleContainer}>
          <h4 className={styles.bundleHeader}>
            {bundle.dogName}을 위한 맞춤 패키지
          </h4>
          <div className={styles.treatsList}>
            {bundle.treats.map((treat, treatIndex) => (
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
                {/* <p>무게: {treat.treatsWeight}g</p> */}
                {/* 여기에서 간식 수정 기능 추가 가능 */}
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
      {/* 장바구니 비우기 버튼 오른쪽 정렬 */}
      <div className={styles.clearCartContainer}>
        <button className={styles.clearCartButton} onClick={handleRemoveBundle}>
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
          <span>= {cart.totalPrice}원</span>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
