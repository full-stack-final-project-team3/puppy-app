import React, { useEffect, useState } from "react";
import { TREATS_URL } from "../../config/user/host-config";
import { useRouteLoaderData, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from "./ShopMain.module.scss";

const ShopMain = () => {
  const [dogList, setDogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedDogName, setSelectedDogName] = useState(""); // 선택한 강아지 이름 상태 추가

  const token = useRouteLoaderData("getToken");
  const navigate = useNavigate(); // useNavigate 훅 사용
  
  useEffect(() => {
    const fetchDogList = async () => {
      try {
        const response = await fetch(TREATS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        console.log(data);
        setDogList(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogList();
  }, [TREATS_URL, token]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDogId(selectedId);
    
    // 선택한 강아지 이름 설정
    const selectedDog = dogList.find(dog => dog.id === selectedId);
    setSelectedDogName(selectedDog ? selectedDog.dogName : ""); // 이름 설정
  };

  const handleStartClick = () => {
    if (selectedDogId) {
      // 선택된 강아지 ID를 기반으로 쇼핑 페이지로 이동
      navigate(`/list/${selectedDogId}`, { state: { dogName: selectedDogName } }); // 경로를 설정
    } else {
      alert("강아지를 선택해 주세요!");
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className={styles.shopMain}>
      <div className={styles.content}>
        <h1>내 강아지 목록</h1>
        {dogList.length === 0 ? (
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
        )}
        {selectedDogId && <p>선택한 강아지 id: {selectedDogId}</p>} {/* 선택한 강아지 이름 표시 */}
        <button onClick={handleStartClick} className={styles.startButton}>
          start
        </button>
      </div>
    </div>
  );
};

export default ShopMain;
