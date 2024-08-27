import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShopMainBg.module.scss";
import { useSelector, useDispatch } from "react-redux";
import ShopMainBg from "./ShopMainBg";
import ManageShop from "./NaviManageBtn.js";
import { AUTH_URL } from "../../config/user/host-config.js";
import { userEditActions } from "../../components/store/user/UserEditSlice"; // 유저 디테일 업데이트 액션 가져오기

const ShopMain = () => {
  const [selectedDog, setSelectedDog] = useState("");
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedDogName, setSelectedDogName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userEdit.userDetail);
  const dogList = isLoggedIn ? user.dogList || [] : [];

  useEffect(() => {
    setIsLoggedIn(user && Object.keys(user).length > 0);
  }, [user]);

  useEffect(() => {
    if (isLoggedIn && selectedDogId) {
      const updatedDog = dogList.find((dog) => dog.id === selectedDogId);
      setSelectedDog(updatedDog);
    }
  }, [dogList, selectedDogId]);

  // 유저 정보 가져오기
  const getUserData = async (email) => {
    try {
      const userDetailData = await (await fetch(`${AUTH_URL}/${email}`)).json();
      dispatch(userEditActions.updateUserDetail(userDetailData)); // 유저 디테일 업데이트
    } catch (error) {
      console.error("유저 정보를 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const email = user.email; // 유저 이메일을 사용
      getUserData(email); // 유저 정보 가져오기
    }
  }, [isLoggedIn, user.email, dispatch]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDogId(selectedId);
    const selectedDog = dogList.find((dog) => dog.id === selectedId);
    setSelectedDog(selectedDog);
    setSelectedDogName(selectedDog ? selectedDog.dogName : "");
  };

  const handleStartClick = () => {
    if (isLoggedIn) {
      if (dogList.length === 0) {
        navigate("/add-dog");
      } else if (selectedDogId) {
        if (selectedDog.hasBundle === true && selectedDog.hasSubs === true) {
          alert("이미 구독 중인 강아지입니다!");
          return;
        } else if (
          selectedDog.hasBundle === true &&
          selectedDog.hasSubs === false
        ) {
          navigate("/cart");
          return;
        }
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
    <>
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
    </>
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
