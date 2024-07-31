import React, { useEffect, useState } from "react";
import { TREATS_URL } from "../../config/user/host-config";
import { useRouteLoaderData, useNavigate } from "react-router-dom";
import styles from "./ShopMain.module.scss";
import {useSelector} from "react-redux";

const ShopMain = () => {
  const [dogList, setDogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedDogName, setSelectedDogName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const tokenData = useRouteLoaderData("getToken");
  const token = tokenData ? tokenData.token : null; // null 체크 후 token 가져오기
  const navigate = useNavigate();
  const user = useSelector(state => state.userEdit.userDetail);

  console.log(user);

  const fetch = useSelector(state => state.userEdit.userDetail);
  console.log(fetch)

  useEffect(() => {
    const fetchDogList = async () => {
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

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
        setDogList(user.dogList);
        setIsLoggedIn(true);
      } catch (err) {
        setError(err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDogList();
  }, [TREATS_URL, token]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDogId(selectedId);
    const selectedDog = dogList.find((dog) => dog.id === selectedId);
    setSelectedDogName(selectedDog ? selectedDog.dogName : "");
  };

  const handleStartClick = () => {
    if (selectedDogId) {
      navigate(`/list/${selectedDogId}`, {
        state: { dogName: selectedDogName },
      });
    } else if (dogList.length === 0) {
      navigate("/add-dog");
    } else {
      alert("강아지를 선택해주세요!");
    }
  };

  const redirectLogin = () => {
    navigate('/login')
  }

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>에러가 발생했습니다: {error.message}</div>
    );
  }

  return (
    <div className={styles.shopMain}>
      <div className={styles.content}>
        <h1>내 강아지 목록</h1>
        {user.dogList.length === 0 ? (
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
              {user.dogList.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.dogName}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedDogId && <p>선택한 강아지 id: {selectedDogId}</p>}


          <button onClick={handleStartClick} className={styles.startButton}>
            start
          </button>

      </div>
    </div>
  );
};

export default ShopMain;
