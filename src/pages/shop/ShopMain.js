import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShopMainBg.module.scss";
import { useSelector } from "react-redux";
import ShopMainBg from "./ShopMainBg";
import ManageShop from "./NaviManageBtn";
import Footer from "../../layout/user/Footer";

const ShopMain = () => {
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedDogName, setSelectedDogName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);
  const dogList = isLoggedIn ? user.dogList || [] : [];

  useEffect(() => {
    setIsLoggedIn(user && Object.keys(user).length > 0);
  }, [user]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDogId(selectedId);
    const selectedDog = dogList.find((dog) => dog.id === selectedId);
    setSelectedDogName(selectedDog ? selectedDog.dogName : "");
  };

  const handleStartClick = () => {
    if (isLoggedIn) {
      if (dogList.length === 0) {
        navigate("/add-dog");
      } else if (selectedDogId) {
        navigate(`/list/${selectedDogId}`, {
          state: { dogName: selectedDogName },
        });
      } else {
        alert("강아지를 선택해주세요!");
      }
    } else {
      navigate("/login");
    }
  };

  const shopContent = (
    <div>
      {isLoggedIn ? (
        dogList.length === 0 ? (
          <p className={styles.guide}>강아지를 등록해 주세요.</p>
        ) : (
          <div className={styles.selectDogBox}>
            <select
              id="dogSelect"
              value={selectedDogId}
              onChange={handleSelectChange}
              className={styles.dogList}
            >
              <option value="">-- 강아지를 선택하세요 --</option>
              {dogList.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.dogName}
                </option>
              ))}
            </select>
          </div>
        )
      ) : (
        <p className={styles.guide}>로그인을 해주세요.</p>
      )}
      <div className={styles.startBtnBox}>
        <button onClick={handleStartClick} className={styles.startButton}>
          {isLoggedIn
            ? dogList.length === 0
              ? "등록하기"
              : "Let's Doggle!"
            : "로그인"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.shopMainBgContainer}>
        <ShopMainBg
          content={shopContent}
          manageShopBtn={<ManageShop isLoggedIn={isLoggedIn} user={user} />}
        />
      </div>
    </>
  );
};

export default ShopMain;
