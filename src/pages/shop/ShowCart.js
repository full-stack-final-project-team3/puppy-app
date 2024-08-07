import React, { useEffect, useState } from "react";
import { getUserToken } from "../../config/user/auth";
import styles from "./ShowCart.module.scss";
import { useNavigate } from "react-router-dom";

const ShowCart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const token = getUserToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:8888/cart", {
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
        setCart(data); // 장바구니 데이터를 상태에 저장
        console.log(data);
      } catch (error) {
        setError(error.message); // 오류 메시지 저장
      }
    };

    fetchCart();
  }, [token]);

  if (error) {
    return <div className={styles.cartContainer}>오류: {error}</div>; // 오류 메시지 표시
  }

  if (!cart) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 중 표시
  }

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>장바구니</h2>
      {cart.bundles && cart.bundles.length > 0 ? (
        <ul className={styles.cartList}>
          {cart.bundles.map((bundle, index) => (
            <li key={index}>
              <span className={styles.itemTitle}>{bundle.treats[0].treatsTitle}</span>
              <span className={styles.itemRemove}>삭제</span>{" "}
              {/* 삭제 버튼 추가 */}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyCartContainer}>
          <div className={styles.emptyCartIcon}>🛒</div> {/* 장바구니 아이콘 */}
          <div className={styles.emptyCartMessage}>
            장바구니가 비어있습니다.
          </div>
          <button className={styles.shopButton} onClick={() => navigate('/treats')}>
            Shop Now!
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowCart;
