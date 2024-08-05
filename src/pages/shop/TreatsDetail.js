import React, { useEffect, useState } from "react";
import styles from "./TreatsDetail.module.scss"; // 필요한 스타일이 있다면 추가

const TreatDetail = ({ treatsId }) => {
  // const { id: treatsId } = useParams(); // URL 파라미터에서 ID 추출
  const [treats, setTreats] = useState(null); // 간식 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchTreatDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8888/treats/${treatsId}`
        );
        if (!response.ok) {
          throw new Error("간식 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setTreats(data); // 가져온 데이터로 상태 업데이트
        console.log(data);
      } catch (err) {
        setError(err.message); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    if (treatsId) {
      fetchTreatDetail(); // treatId가 있을 때만 데이터 요청
    } else {
      setLoading(false); // treatId가 없으면 로딩 완료
    }
  }, [treatsId]); // treatId가 변경될 때마다 데이터 재요청

  if (loading) return <div>로딩 중...</div>; // 로딩 중일 때 표시
  if (error) return <div>에러: {error}</div>; // 에러 발생 시 표시
  if (!treats) return null; // treat가 없으면 null 반환

  return (
    <div className={styles.treatDetail}>
      <h2>{treats.title}</h2>
      {treats.weight && <p>무게: {treats.weight}g</p>} {/* 제품 무게 추가 */}
      {treats.description && <p>{treats.description}</p>}
      {/* 간식 이미지 표시 */}
      {Array.isArray(treats.treatsPics) && treats.treatsPics.length > 0 && (
        <img
          src={`http://localhost:8888${treats.treatsPics[0].treatsPic.replace(
            "/local",
            "/treats/images"
          )}`}
          alt={treats.title}
          className={styles.treatsImage}
        />
      )}
      {/* 추가적인 상세 이미지 표시 */}
      {Array.isArray(treats.treatsDetailPics) &&
        treats.treatsDetailPics.length > 0 && (
          <div className={styles.detailPics}>
            {treats.treatsDetailPics.map((pic) => (
              <img
                key={pic.id}
                src={`http://localhost:8888${pic.treatsDetailPic.replace(
                  "/local",
                  "/treats/images"
                )}`}
                alt={treats.title}
                className={styles.detailImage}
              />
            ))}
          </div>
        )}
      {/* 추가적인 간식 정보 표시 */}
    </div>
  );
};

export default TreatDetail;
