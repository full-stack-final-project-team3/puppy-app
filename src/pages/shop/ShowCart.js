import React, { useEffect, useState } from "react";
import { getUserToken } from "../../config/user/auth";
import styles from "./ShowCart.module.scss";
import { useNavigate } from "react-router-dom";
import { CART_URL } from "../../config/user/host-config";

// ShowCart.js
const ShowCart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const token = getUserToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${CART_URL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("장바구니 정보를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();
        setCart(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCart();
  }, [token]);

  const handleRemoveBundle = async (bundleId) => {
    try {
      const response = await fetch(`${CART_URL}/${bundleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("번들을 삭제하는 데 실패했습니다.");
      }

      // 상태 업데이트
      setCart((prevCart) => ({
        ...prevCart,
        bundles: prevCart.bundles.filter((bundle) => bundle.id !== bundleId),
      }));
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  if (error) {
    return <div className={styles.cartContainer}>오류: {error}</div>;
  }

  if (!cart) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>장바구니</h2>
      {cart.bundles && cart.bundles.length > 0 ? (
        <div className={styles.cartList}>
          {cart.bundles.map((bundle) => (
            <div key={bundle.id} className={styles.bundleContainer}>
              <h4 className={styles.bundleHeader}>
                {bundle.dogName}을 위한 맞춤 패키지
              </h4>
              <div className={styles.treatsList}>
                {bundle.treats.map((treat, treatIndex) => (
                  <div key={treatIndex} className={styles.treatItem}>
                    <h5 className={styles.itemTitle}>{treat.treatsTitle}</h5>
                    <p>무게: {treat.treatsWeight}g</p>
                    {/* 여기에서 간식 수정 기능 추가 가능 */}
                  </div>
                ))}
              </div>
              <div className={styles.bundleFooter}>
                <span className={styles.bundlePrice}>
                  가격: {bundle.bundlePrice.toLocaleString()}원
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
        </div>
      ) : (
        <div className={styles.emptyCartContainer}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <div className={styles.emptyCartMessage}>
            장바구니가 비어있습니다.
          </div>
          <button
            className={styles.shopButton}
            onClick={() => navigate("/treats")}
          >
            Shop Now!
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowCart;
