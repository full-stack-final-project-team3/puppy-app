import React, { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useParams, useLocation } from "react-router-dom";
import { TREATS_URL, AUTH_URL } from "../../config/user/host-config";
import styles from "./TreatsListForDog.module.scss";
import CreateBundle from "../../components/shop/CreateBundle";
import Modal from "./TreatsDetailModal";
import ShopStepIndicator from "./ShopStepIndicator";

const TreatsListForDog = () => {
  const { dogId } = useParams();
  const location = useLocation();
  const dogName = location.state?.dogName;
  const [treatsList, setTreatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTreats, setSelectedTreats] = useState({
    DRY: [],
    WET: [],
    GUM: [],
    KIBBLE: [],
    SUPPS: [],
  });
  const [removingTreats, setRemovingTreats] = useState({}); // 애니메이션 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTreatId, setCurrentTreatId] = useState(null);
  const treatTypes = ["DRY", "WET", "GUM", "KIBBLE", "SUPPS"];

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex); // 클릭한 스텝으로 이동
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        console.log("무한 스크롤 이벤트 실행");
        if (treatsList.length <= totalCount) {
          setPageNo((prevPage) => prevPage + 1); // 페이지 번호 증가
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, treatsList, totalCount]);

  const fetchTreatsList = async () => {
    // 현재 타입 가져오기
    const currentType = treatTypes[currentStep];

    // 선택된 간식의 타입을 확인하여 조회에서 제외
    if (selectedTreats[currentType].length > 0) {
      // 현재 타입의 인덱스를 기반으로 다음 타입을 설정
      let nextType = currentStep + 1;

      // 비어있는 다음 타입을 찾기
      while (
        nextType < treatTypes.length &&
        selectedTreats[treatTypes[nextType]].length > 0
      ) {
        nextType++;
      }

      // 비어있는 다음 타입이 있는 경우, 해당 타입을 조회
      if (nextType < treatTypes.length) {
        setCurrentStep(nextType); // 다음 타입으로 스텝 이동
        return; // 현재 타입에 대한 조회를 생략
      } else {
        return; // 모든 타입이 선택된 경우 조회하지 않음
      }
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

      setLoading(true); // 로딩 상태 시작

      // 1초 후에 데이터를 렌더링
      setTimeout(() => {
        // currentStep이 바뀔 때는 리스트 초기화
        if (pageNo === 1) {
          setTreatsList(data.treatsList);
          setTotalCount(data.totalCount);
        } else {
          setTreatsList((prevList) => [...prevList, ...data.treatsList]);
        }
      }, 800); // 1초 지연

      console.log(data);
      console.log(currentStep);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatsList();
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

    // 다음 타입으로 스텝 이동
    setCurrentStep((prevStep) => {
      const nextStep = Math.min(prevStep + 1, treatTypes.length - 1);
      setPageNo(1); // 간식 선택 시 pageNo를 1로 초기화
      return nextStep;
    });
  };

  const handleRemoveTreat = (type, treat) => {
    // 애니메이션 클래스를 추가
    setRemovingTreats((prev) => ({
      ...prev,
      [treat.title]: true,
    }));

    // 애니메이션이 끝난 후 실제로 삭제
    setTimeout(() => {
      removeTreat(type, treat);
      setRemovingTreats((prev) => {
        const { [treat.title]: _, ...rest } = prev; // 애니메이션이 끝난 후 상태에서 제거
        return rest;
      });
    }, 800); // 애니메이션 시간과 일치
  };

  const removeTreat = (type, treat) => {
    setSelectedTreats((prevSelected) => {
      const updatedTreats = prevSelected[type].filter(
        (selectedTreat) => selectedTreat.title !== treat.title
      );
      return { ...prevSelected, [type]: updatedTreats };
    });

    // 현재 선택된 간식 타입 검사 및 다음 타입으로 이동
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
        setPageNo(1); // 간식 선택 시 pageNo를 1로 초기화
        return treatTypes.indexOf(emptyTypes[0]); // 비어있는 타입으로 스텝 이동
      }

      return prevStep; // 이전 스텝 유지
    });
  };

  console.log(selectedTreats);

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
      <ShopStepIndicator step={currentStep} onStepClick={handleStepClick} />
      {/* <TransitionGroup>
        <CSSTransition
          in={true} // 항상 true로 설정하여 애니메이션 적용
          key={currentStep} // currentStep이 바뀔 때마다 애니메이션 재생
          timeout={700} // 애니메이션 시간
          classNames="page" // 애니메이션 클래스 이름
        > */}
          <div className={`${styles.treatsList} page`}>
            <div className={styles.content}>
              <h1>{dogName ? `${dogName}` : "강아지"} 맞춤 간식</h1>
              <div>
                {loading ? ( // 로딩 중일 때
                  <p>로딩 중...</p>
                ) : (
                  // : treatsList.length === 0 ? (
                  //   <p>등록된 {treatTypes[currentStep]} 간식이 없습니다.</p>
                  // )
                  <div className={styles.cardContainer}>
                    {treatsList.map((treat) => {
                      const hasTreatPics =
                        Array.isArray(treat["treats-pics"]) &&
                        treat["treats-pics"].length > 0;
                      const imageUrl = hasTreatPics
                        ? `${AUTH_URL}${treat[
                            "treats-pics"
                          ][0].treatsPic.replace("/local", "/treats/images")}`
                        : `${AUTH_URL}/treats/images/default.webp`;

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
                          <div className={styles.addBtnContainer}>
                            <button
                              className={styles.addBtn}
                              onClick={() => toggleTreatSelection(treat)}
                            >
                              선택하기
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        {/* </CSSTransition>
      </TransitionGroup> */}

      <div className={styles.selectedTreats}>
        <div className={styles.imageBoxContainer}>
          {treatTypes.map((type, typeIndex) => (
            <div className={styles.imageBox} key={typeIndex}>
              {selectedTreats[type].length > 0 ? (
                selectedTreats[type].map((treat) => (
                  <div
                    key={treat.title}
                    className={`${styles.treatWrapper} ${
                      removingTreats[treat.title] ? styles.slideOut : ""
                    }`}
                  >
                    <img
                      src={`${AUTH_URL}${treat[
                        "treats-pics"
                      ][0].treatsPic.replace("/local", "/treats/images")}`}
                      alt={treat.title}
                      className={styles.treatImage}
                    />
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveTreat(type, treat)}
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
