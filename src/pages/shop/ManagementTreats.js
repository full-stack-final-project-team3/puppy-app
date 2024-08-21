import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserToken } from "../../config/user/auth";
import { TREATS_URL } from "../../config/user/host-config";
import { AUTH_URL } from "../../config/user/host-config";
import styles from "./ManagementTreats.module.scss";
import ManagementBtn from "./ManagementBtn";
import Modal from "./TreatsDetailModal";

const ManagementTreats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatsList, setTreatsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [selectedTreatId, setSelectedTreatId] = useState(null); // 선택된 간식 ID
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const token = getUserToken();

  useEffect(() => {
    const fetchTreats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${TREATS_URL}/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        setTreatsList(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreats();
  }, [token]);

  const filteredTreats = treatsList.filter((treat) =>
    treat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-treats/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${TREATS_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("삭제 요청이 실패했습니다.");
      }

      setTreatsList(treatsList.filter((treat) => treat.id !== id));
      alert("삭제가 완료되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const openModal = (id) => {
    const viewportHeight = window.innerHeight; // 현재 뷰포트의 높이
    const scrollY = window.scrollY; // 현재 스크롤 위치
    const modalHeight = 800; // 모달의 높이
    const topPosition = scrollY + (viewportHeight - modalHeight) / 2; // 중앙 위치 계산
    setModalPosition({ x: window.innerWidth / 2, y: topPosition }); // 좌우 중앙, 세로는 계산된 위치
    setSelectedTreatId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTreatId(null);
    setModalPosition({ x: 0, y: 0 });
  };

  const toggleTreatSelection = () => {
    return;
  }

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className={styles.treatsList}>
      <div className={styles.content}>
        <h1>전체 상품 목록</h1>
        <input
          type="text"
          placeholder="간식 이름 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div>
          {filteredTreats.length === 0 ? (
            <p>등록된 간식이 없습니다.</p>
          ) : (
            <div className={styles.listContainer}>
              {filteredTreats.map((treat) => {
                const hasTreatPics =
                  Array.isArray(treat["treats-pics"]) &&
                  treat["treats-pics"].length > 0;
                const imageUrl = hasTreatPics
                  ? `${AUTH_URL}${treat["treats-pics"][0].treatsPic.replace(
                      "/local",
                      "/treats/images"
                    )}`
                  : `${AUTH_URL}/treats/images/default.webp`;

                return (
                  <div className={styles.listItem} key={treat.id}>
                    <img
                      src={imageUrl}
                      className={styles.imageBox}
                      alt={treat.title}
                      onClick={() => openModal(treat.id)} // 간식 이름 클릭 시 모달 열기
                    />
                    <h4
                      className={styles.cardTitle}
                      onClick={() => openModal(treat.id)}
                    >
                      {treat.title}
                    </h4>
                    <ManagementBtn
                      onEdit={() => handleEdit(treat.id)}
                      onDelete={() => handleDelete(treat.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        treatsId={selectedTreatId}
        modalPosition={modalPosition}
        toggleTreatSelection={toggleTreatSelection}
      />
    </div>
  );
};

export default ManagementTreats;
