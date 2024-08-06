import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { TREATS_URL } from "../../config/user/host-config";
import styles from "./TreatsListForDog.module.scss";
import CreateBundle from "../../components/shop/CreateBundle";
import Modal from "./TreatsDetailModal";

const TreatsListForDog = () => {
  const { dogId } = useParams();
  const location = useLocation();
  const dogName = location.state?.dogName;
  const [treatsList, setTreatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTreats, setSelectedTreats] = useState({
    DRY: [],
    WET: [],
    GUM: [],
    KIBBLE: [],
    SUPPS: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTreatId, setCurrentTreatId] = useState(null);
  const treatTypes = ["DRY", "WET", "GUM", "KIBBLE", "SUPPS"];

  const fetchTreatsList = async (currentType) => {
    // 선택된 간식의 타입을 확인하여 조회에서 제외
    if (selectedTreats[currentType].length > 0) {
      // 현재 타입의 인덱스를 기반으로 다음 타입을 설정
      let nextType = treatTypes.indexOf(currentType);

      // 다음 타입이 비어있지 않을 경우 계속해서 다음 타입으로 이동
      while (
        nextType < treatTypes.length &&
        selectedTreats[treatTypes[nextType]].length > 0
      ) {
        nextType++; // 비어있는 타입을 찾기 위해 인덱스 증가
      }

      // 다음 타입이 유효한 경우에만 조회
      if (nextType < treatTypes.length) {
        fetchTreatsList(treatTypes[nextType]); // 비어있는 다음 타입으로 재귀 호출
      }
      return; // 조회하지 않음
    }

    try {
      const response = await fetch(
        `${TREATS_URL}/list/${dogId}?pageNo=${pageNo}&sort=${currentType}`,
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
      console.log(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (treatTypes[currentStep]) {
      fetchTreatsList(treatTypes[currentStep]);
    }
  }, [dogId, pageNo, currentStep]);

  const toggleTreatSelection = (treat) => {
    const currentType = treatTypes[currentStep];

    setSelectedTreats((prevSelected) => {
      const isSelected = prevSelected[currentType].some(
        (selected) => selected.id === treat.id
      );
      return {
        ...prevSelected,
        [currentType]: isSelected
          ? prevSelected[currentType]
          : [...prevSelected[currentType], treat],
      };
    });

    setCurrentStep((prevStep) => Math.min(prevStep + 1, treatTypes.length - 1));
  };

  const removeTreat = (type, treat) => {
    setSelectedTreats((prevSelected) => {
      const updatedTreats = prevSelected[type].filter(
        (selectedTreat) => selectedTreat.title !== treat.title
      );
      return { ...prevSelected, [type]: updatedTreats };
    });

    // 현재 선택된 간식 타입 검사
    setCurrentStep((prevStep) => {
      const updatedSelectedTreats = {
        ...selectedTreats,
        [type]: selectedTreats[type].filter(
          (selectedTreat) => selectedTreat.title !== treat.title
        ),
      };

      // 비어있는 타입이 있는지 확인
      const emptyTypes = treatTypes.filter(
        (treatType) => updatedSelectedTreats[treatType].length === 0
      );

      if (emptyTypes.length > 0) {
        // 비어있는 타입이 있다면 해당 타입의 간식 리스트를 재조회
        fetchTreatsList(emptyTypes[0]);
        return treatTypes.indexOf(emptyTypes[0]); // 비어있는 타입으로 스텝 이동
      }

      return prevStep; // 이전 스텝 유지
    });
  };

  const openModal = (treat) => {
    setCurrentTreatId(treat.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTreatId(null);
  };

  return (
    <>
      <div className={styles.treatsList}>
        <div className={styles.content}>
          <h1>{dogName ? `${dogName}` : "강아지"} 맞춤 간식</h1>
          <div>
            <h2>{treatTypes[currentStep]}</h2>
            {treatsList.length === 0 ? (
              <p>등록된 {treatTypes[currentStep]} 간식이 없습니다.</p>
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
                    : "http://localhost:8888/treats/images/default.webp";

                  return (
                    <div className={styles.card} key={treat.id}>
                      <img
                        src={imageUrl}
                        className={`${styles.cardImageTop} img-fluid`}
                        alt={treat.title}
                        onClick={() => openModal(treat)}
                      />
                      <div className={styles.cardBody}>
                        <h4
                          className={styles.cardTitle}
                          onClick={() => openModal(treat)}
                        >
                          {treat.title}
                        </h4>
                      </div>
                      <button
                        className={styles.addBtn}
                        onClick={() => toggleTreatSelection(treat)}
                      >
                        선택하기
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.selectedTreats}>
          <div className={styles.imageBoxContainer}>
            {treatTypes.map((type, typeIndex) => (
              <div className={styles.imageBox} key={typeIndex}>
                {selectedTreats[type].length > 0 ? (
                  selectedTreats[type].map((treat) => (
                    <div key={treat.title} className={styles.treatWrapper}>
                      <img
                        src={`http://localhost:8888${treat[
                          "treats-pics"
                        ][0].treatsPic.replace("/local", "/treats/images")}`}
                        alt={treat.title}
                        className={styles.treatImage}
                      />
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeTreat(type, treat)}
                      >
                        ✖
                      </button>
                    </div>
                  ))
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8212/8212741.png"
                    alt={`가상의 간식 ${typeIndex + 1}`}
                    className={styles.treatImage}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateBundle selectedTreats={selectedTreats} dogId={dogId} />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        treatsId={currentTreatId}
      />
    </>
  );
};

export default TreatsListForDog;
