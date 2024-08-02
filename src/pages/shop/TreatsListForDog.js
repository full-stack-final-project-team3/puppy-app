import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { TREATS_URL } from "../../config/user/host-config";
import styles from "./TreatsListForDog.module.scss";
import CreateBundle from "../../components/shop/CreateBundle";

const TreatsListForDog = () => {
  const { dogId } = useParams();
  const location = useLocation();
  const dogName = location.state?.dogName;
  const [treatsList, setTreatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [sort, setSort] = useState("default");
  const [selectedTreats, setSelectedTreats] = useState([]);

  useEffect(() => {
    const fetchTreatsList = async () => {
      try {
        const response = await fetch(
          `${TREATS_URL}/list/${dogId}?pageNo=${pageNo}&sort=${sort}`,
          {
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
        setTreatsList(data.treatsList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatsList();
  }, [dogId, pageNo, sort]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>에러가 발생했습니다: {error.message}</div>
    );
  }

  const toggleTreatSelection = (treat) => {
    console.log(treat);
    setSelectedTreats((prevSelected) => {
      if (prevSelected.some((item) => item.id === treat.id)) {
        return prevSelected.filter((item) => item.id !== treat.id);
      } else {
        return [...prevSelected, treat];
      }
    });
  };

  return (
    <>
      <div className={styles.treatsList}>
        <div className={styles.content}>
          <h1>{dogName ? `${dogName}` : "강아지"} 맞춤 간식 </h1>
          {treatsList.length === 0 ? (
            <p>등록된 간식이 없습니다.</p>
          ) : (
            <div className={styles.cardContainer}>
              {treatsList.map((treat) => {
                const hasTreatPics =
                  Array.isArray(treat["treats-pics"]) &&
                  treat["treats-pics"].length > 0;
                const imageUrl = hasTreatPics
                  ? `http://localhost:8888${treat[
                      "treats-pics"
                    ][0].treatsPic.replace("/local", "/treats/images")}`
                  : "http://localhost:8888/treats/images/2024/07/31/bb554f82-4752-423d-bfd3-c32550203d42_1200x0.webp";
                return (
                  <div className={styles.card} key={treat.id}>
                    <img
                      src={imageUrl}
                      className={`${styles.cardImageTop} img-fluid`}
                      alt={treat.title}
                    />
                    <div className={styles.cardBody}>
                      <h4 className={styles.cardTitle}>{treat.title}</h4>
                    </div>
                    <button
                      className={styles.addBtn}
                      onClick={() => toggleTreatSelection(treat)}
                    >
                      add
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 선택한 간식 목록 표시 */}
        <div className={styles.selectedTreats}>
          <div className={styles.imageBoxContainer}>
            {[...Array(5)].map((_, index) => (
              <div className={styles.imageBox} key={index}>
                {selectedTreats[index] ? (
                  <img
                    src={`http://localhost:8888${selectedTreats[index][
                      "treats-pics"
                    ][0].treatsPic.replace("/local", "/treats/images")}`}
                    alt={selectedTreats[index].title}
                    className={styles.treatImage}
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8212/8212741.png"
                    alt={`가상의 간식 ${index + 1}`}
                    className={styles.treatImage}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateBundle selectedTreats={selectedTreats} dogId={dogId} />
    </>
  );
};

export default TreatsListForDog;
