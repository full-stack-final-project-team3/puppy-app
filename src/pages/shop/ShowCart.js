import React, { useEffect, useState } from "react";
import { getUserToken } from "../../config/user/auth";

const ShowCart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const token = getUserToken();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:8888/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("장바구니 정보를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();

        setCart(data); // 장바구니 데이터를 상태에 저장
      } catch (error) {
        setError(error.message); // 오류 메시지 저장
      }
    };

    fetchCart();
  }, [token]);

  if (error) {
    return <div>오류: {error}</div>; // 오류 메시지 표시
  }

  if (!cart) {
    return <div>로딩 중...</div>; // 로딩 중 표시
  }

  return (
    <div>
      <h2>장바구니</h2>
      {cart.bundles && cart.bundles.length > 0 ? (
        <ul>
          {/* {cart.bundles.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity}개
            </li>
          ))} */}
        </ul>
      ) : (
        <div>장바구니가 비어있습니다.</div>
      )}
    </div>
  );
};

export default ShowCart;
