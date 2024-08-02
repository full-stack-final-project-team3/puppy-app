import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ShopMain.module.scss";
import { useSelector } from "react-redux";

const ShopMain = () => {
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedDogName, setSelectedDogName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();
  const user = useSelector((state) => state.userEdit.userDetail);
  const dogList = isLoggedIn ? user.dogList || [] : []; // 로그인 상태에 따라 강아지 목록 설정

  console.log(user);
  
  useEffect(() => {
    // 로그인 상태 확인 및 업데이트
    setIsLoggedIn(user && Object.keys(user).length > 0);
  }, [user]); // user가 변경될 때마다 실행

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDogId(selectedId);
    const selectedDog = dogList.find((dog) => dog.id === selectedId);
    setSelectedDogName(selectedDog ? selectedDog.dogName : "");
  };

  const handleStartClick = () => {
    if (isLoggedIn) {
      if (selectedDogId) {
        navigate(`/list/${selectedDogId}`, {
          state: { dogName: selectedDogName },
        });
      } else {
        alert("강아지를 선택해주세요!"); // 강아지를 선택하지 않았을 때 경고
      }
    } else {
      navigate("/login"); // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    }
  };

  const handleAddClick = () => {
    navigate('/add-treats')
  };

  return (
    <div className={styles.shopMain}>
      <div className={styles.content}>
        <h1>내 강아지 목록</h1>
        {isLoggedIn &&
          user.role === "ADMIN" && ( // admin 역할일 때만 상품 추가 버튼 표시
            <button onClick={handleAddClick} className={styles.newTreatsBtn}>
              상품 추가
            </button>
          )}
        {isLoggedIn ? ( // 로그인 상태일 때
          dogList.length === 0 ? ( // 강아지가 없는 경우
            <p>등록된 강아지가 없습니다. 강아지를 등록해 주세요.</p>
          ) : (
            <div>
              <label htmlFor="dogSelect">강아지를 선택하세요:</label>
              <select
                id="dogSelect"
                value={selectedDogId}
                onChange={handleSelectChange}
              >
                <option value="">-- 선택하세요 --</option>
                {dogList.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.dogName}
                  </option>
                ))}
              </select>
            </div>
          )
        ) : (
          <p>로그인을 해주세요.</p> // 로그인하지 않은 경우 안내 메시지
        )}
        <button onClick={handleStartClick} className={styles.startButton}>
          {isLoggedIn ? "시작" : "로그인"}{" "}
          {/* 유저 정보에 따라 버튼 텍스트 변경 */}
        </button>
      </div>
    </div>
  );
};

export default ShopMain;
