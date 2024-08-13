import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShopMainBg.module.scss";

const ManageShop = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();

  const handleManagementClick = () => {
    navigate("/manage-treats");
  };

  const handleAddClick = () => {
    navigate("/add-treats");
  };

  return (
    <div className={styles.buttonContainer}>
      {isLoggedIn && user.role === "ADMIN" && (
        <button onClick={handleManagementClick} className={styles.newTreatsBtn}>
          상품 관리
        </button>
      )}
      {isLoggedIn && user.role === "ADMIN" && (
        <button onClick={handleAddClick} className={styles.newTreatsBtn}>
          상품 추가
        </button>
      )}
    </div>
  );
};

export default ManageShop;
