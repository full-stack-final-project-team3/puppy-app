import React, { useEffect, useState } from "react";
import TreatsDetailContent from "./TreatsDetailContent";
import { TREATS_URL } from "../../config/user/host-config";

const TreatDetail = ({ treatsId, toggleTreatSelection }) => {
  // const { id: treatsId } = useParams(); // URL 파라미터에서 ID 추출
  const [treats, setTreats] = useState(null); // 간식 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchTreatDetail = async () => {
      try {
        const response = await fetch(`${TREATS_URL}/${treatsId}`);
        if (!response.ok) {
          throw new Error("간식 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setTreats(data); // 가져온 데이터로 상태 업데이트
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
    <TreatsDetailContent
      key={treats.id}
      treat={treats}
      toggleTreatSelection={toggleTreatSelection}
    />
  );
};

export default TreatDetail;
