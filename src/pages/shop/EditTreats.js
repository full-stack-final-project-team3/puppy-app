import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditTreat = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [treat, setTreat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreat = async () => {
      // ID에 해당하는 간식 데이터를 가져오는 API 호출
      const response = await fetch(`YOUR_API_URL/${id}`); // API URL 수정 필요
      const data = await response.json();
      setTreat(data);
      setLoading(false);
    };

    fetchTreat();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;

  // 수정 폼 구현
  const handleSubmit = (e) => {
    e.preventDefault();
    // 수정 요청 처리 로직 추가
  };

  return (
    <div>
      <h1>간식 수정</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={treat.title} onChange={(e) => setTreat({ ...treat, title: e.target.value })} />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default EditTreat;
