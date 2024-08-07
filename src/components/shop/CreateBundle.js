import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../config/user/auth";

const CreateBundle = ({ selectedTreats, dogId, dogName }) => {
  const treatArray = Array.isArray(selectedTreats)
    ? selectedTreats
    : Object.values(selectedTreats).flat();

  console.log(treatArray);

  const token = getUserToken();

  const navigate = useNavigate();

  const handleCreateBundle = async () => {
    if (treatArray.length !== 5) {
      alert("간식은 5개 선택해야 합니다.");
      return;
    }
    const treatIds = treatArray.map((treat) => treat.id);
    const dto = {
      treatIds: treatIds,
    };

    try {
      const response = await fetch(`http://localhost:8888/bundle/${dogId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error("번들 생성 실패");
      }

      // 번들 생성 후 장바구니 생성 및 초기화
      await createCart();
      navigate("/cart"); // 장바구니 화면으로 이동
    } catch (error) {
      alert(error.message);
    }
  };

  const createCart = async () => {
    try {
      const cartResponse = await fetch(`http://localhost:8888/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!cartResponse.ok) {
        throw new Error("장바구니 생성 실패");
      }

      // 장바구니 생성 성공 시 처리
      console.log("장바구니 생성 성공");
    } catch (error) {
      alert(error.message);
    }
  };

  return <button onClick={handleCreateBundle}>번들 생성</button>;
};

export default CreateBundle;
