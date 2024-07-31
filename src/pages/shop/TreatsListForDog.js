import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // useLocation 추가
import { TREATS_URL } from "../../config/user/host-config"; // API URL 설정
import styles from "./TreatsListForDog.module.scss"; // SCSS 파일 import

const TreatsListForDog = () => {
  const { dogId } = useParams(); // URL에서 dogId 가져오기
  const location = useLocation(); // location 훅 사용
  const dogName = location.state?.dogName; // 전달된 강아지 이름 가져오기
  const [treatsList, setTreatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [sort, setSort] = useState("default"); // 정렬 기준 설정 (필요에 따라 변경 가능)
  const [selectedTreats, setSelectedTreats] = useState([]); // 선택한 간식 상태 추가

  useEffect(() => {
    const fetchTreatsList = async () => {
      try {
        const response = await fetch(
          `${TREATS_URL}/list/${dogId}?pageNo=${pageNo}&sort=${sort}`,
          {
            // API 호출
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        console.log("이거머얌", data);
        setTreatsList(data.treatsList); // 가져온 간식 리스트 설정
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatsList();
  }, [dogId, pageNo, sort]); // dogId와 pageNo, sort가 변경될 때마다 호출

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>에러가 발생했습니다: {error.message}</div>
    );
  }

  const toggleTreatSelection = (treat) => {
    setSelectedTreats((prevSelected) => {
      if (prevSelected.some((item) => item.id === treat.id)) {
        // 이미 선택된 간식이면 제거
        return prevSelected.filter((item) => item.id !== treat.id);
      } else {
        // 선택되지 않은 간식이면 추가
        return [...prevSelected, treat];
      }
    });
  };

  return (
    <div className={styles.treatsList}>
      <div className={styles.content}>
        <h1>{dogName ? `${dogName}` : "강아지"} 맞춤 간식</h1>{" "}
        {/* 강아지 이름 표시 */}
        {treatsList.length === 0 ? (
          <p>등록된 간식이 없습니다.</p>
        ) : (
          <ul className={styles.treatList}>
            {treatsList.map((treat) => (
              <li
                className={styles.treat}
                key={treat.id}
                onClick={() => toggleTreatSelection(treat)} // 클릭 시 선택 토글
              >
                {treat.title}
              </li> // 각 간식 이름 표시
            ))}
          </ul>
        )}
        {/* 선택한 간식 목록 표시 */}
        <div className={styles.selectedTreats}>
          <h2>{dogName ? `${dogName}의` : "강아지"} 간식 리스트</h2>
          {selectedTreats.length === 0 ? (
            <p>선택한 간식이 없습니다.</p>
          ) : (
            <ul>
              {selectedTreats.map((treat) => (
                <li key={treat.id}>{treat.title}</li> // 선택한 간식 이름 표시
              ))}
            </ul>
          )}
        </div>
        <img src="http://localhost:8888/treats/images/2024/07/31/bb554f82-4752-423d-bfd3-c32550203d42_1200x0.webp" alt="Uploaded Image" />
        <button className={styles.nextButton}>NEXT</button>
      </div>
    </div>
  );
};

export default TreatsListForDog;
