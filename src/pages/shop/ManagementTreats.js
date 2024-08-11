import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { getUserToken } from "../../config/user/auth";
import { TREATS_URL } from "../../config/user/host-config";
import { AUTH_URL } from "../../config/user/host-config";
import styles from "./ManagementTreats.module.scss";
import ManagementBtn from "./ManagementBtn";

const ManagementTreats = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatsList, setTreatsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
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

      // 삭제 성공 시 상태 업데이트
      setTreatsList(treatsList.filter((treat) => treat.id !== id));

      alert("삭제가 완료되었습니다.");

    } catch (error) {

      console.error("삭제 실패:", error);

      alert("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className={styles.treatsList}>
      <div className={styles.content}>
        <h1>전체 간식 목록</h1>
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
                    />
                    <h4 className={styles.cardTitle}>{treat.title}</h4>
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
    </div>
  );
};

export default ManagementTreats;
