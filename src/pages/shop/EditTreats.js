import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { TREATS_URL } from "../../config/user/host-config";
import styles from "./EditTreats.module.scss";
import { allergiesOptions } from "../../components/auth/dog/DogAllergiesInput";
import { getUserToken } from "../../config/user/auth";
import { AUTH_URL } from "../../config/user/host-config";
import { useNavigate } from "react-router-dom";

const EditTreat = ({}) => {
  const { id } = useParams(); // URL에서 id를 받아옴
  const [title, setTitle] = useState("");
  const [treatsType, setTreatsType] = useState("");
  const [treatsWeight, setTreatsWeight] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [treatsAgeType, setTreatsAgeType] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [treatsPicsInputs, setTreatsPicsInputs] = useState([0]);
  const [treatsDetailPicsInputs, setTreatsDetailPicsInputs] = useState([0]);
  const [previousTreatsPics, setPreviousTreatsPics] = useState([]); // 이전 대표 사진 상태
  const [previousTreatsDetailPics, setPreviousTreatsDetailPics] = useState([]); // 이전 상세 사진 상태
  const treatsPicsInputRefs = useRef([]);
  const treatsDetailPicsInputRefs = useRef([]);
  const token = getUserToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTreat = async () => {
      try {
        const response = await fetch(`${TREATS_URL}/${id}`);
        const data = await response.json();
        setTitle(data.title);
        setTreatsType(data.treatsType);
        setTreatsWeight(data.weight);
        setDogSize(data.dogSize);
        setTreatsAgeType(data.treatsAgeType);
        setSelectedAllergies(data.allergieList || []);
        setPreviousTreatsPics(data["treats-pics"]);
        setPreviousTreatsDetailPics(data["treats-detail-pics"]);
      } catch (error) {
        console.error("간식 데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchTreat();
  }, [id]);

  const handleAllergyChange = (e) => {
    const allergy = e.target.value;
    setSelectedAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((item) => item !== allergy)
        : [...prev, allergy]
    );
  };

  const handleFileChange = (e, type, index) => {
    // 파일 처리 로직 추가 필요
  };

  const addTreatsPicInput = () => {
    setTreatsPicsInputs((prev) => [...prev, prev.length]);
  };

  const addTreatsDetailPicInput = () => {
    setTreatsDetailPicsInputs((prev) => [...prev, prev.length]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTreat = {
      title,
      type: treatsType,
      weight: treatsWeight,
      dogSize,
      treatsAgeType: treatsAgeType,
      allergies: selectedAllergies,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("treatsType", treatsType);
    formData.append("treatsWeight", treatsWeight);
    formData.append("dogSize", dogSize);
    formData.append("treatsAgeType", treatsAgeType);
    formData.append("allergieList", selectedAllergies.join(","));

    // 파일 추가 로직
    treatsPicsInputRefs.current.forEach((input, index) => {
      if (input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
          formData.append(`treatsPics[${index}].treatsPicFile`, file);
        });
      }
    });

    treatsDetailPicsInputRefs.current.forEach((input, index) => {
      if (input.files.length > 0) {
        Array.from(input.files).forEach((file) => {
          formData.append(
            `treatsDetailPics[${index}].treatsDetailPicFile`,
            file
          );
        });
      }
    });

    try {
      const response = await fetch(`${TREATS_URL}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`간식 수정에 실패했습니다: ${errorMessage}`);
      }

      alert("간식이 성공적으로 수정되었습니다.");

      navigate('/manage-treats')

    } catch (error) {
      console.error("수정 요청 실패:", error);
      alert("수정 요청에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className={styles.editTreats}>
      <h1>간식 수정</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>상품 제목</label>
          <input
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>상품 종류</label>
          <select
            className={styles.inputField}
            value={treatsType}
            onChange={(e) => setTreatsType(e.target.value)}
            required
          >
            <option value="" disabled>
              상품 종류 선택
            </option>
            <option value="DRY">DRY</option>
            <option value="WET">WET</option>
            <option value="GUM">GUM</option>
            <option value="KIBBLE">KIBBLE</option>
            <option value="SUPPS">SUPPS</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>무게</label>
          <input
            type="text"
            className={styles.inputField}
            value={treatsWeight}
            onChange={(e) => setTreatsWeight(e.target.value)}
            required
          />
          <span>g</span>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>대상 강아지 사이즈</label>
          <select
            className={styles.inputField}
            value={dogSize}
            onChange={(e) => setDogSize(e.target.value)}
            required
          >
            <option value="" disabled>
              강아지 사이즈 선택
            </option>
            <option value="SMALL">SMALL</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LARGE">LARGE</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>대상 강아지 연령층</label>
          <select
            className={styles.inputField}
            value={treatsAgeType}
            onChange={(e) => setTreatsAgeType(e.target.value)}
            required
          >
            <option value="" disabled>
              강아지 연령층 선택
            </option>
            <option value="BABY">BABY</option>
            <option value="OLD">OLD</option>
            <option value="ALL">ALL</option>
          </select>
        </div>
        <label className={styles.label}>알러지 유발 항목</label>
        <div className={styles.checkboxGroup}>
          {allergiesOptions.map((allergy) => (
            <div key={allergy.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                value={allergy.value}
                onChange={handleAllergyChange}
                checked={selectedAllergies.includes(allergy.value)}
              />
              <span className={styles.checkboxLabel}>{allergy.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>대표 사진</label>
          {treatsPicsInputs.map((_, index) => (
            <div key={index}>
              <input
                type="file"
                className={styles.inputField}
                onChange={(e) => handleFileChange(e, "treatsPics", index)}
                ref={(el) => (treatsPicsInputRefs.current[index] = el)}
                multiple
              />
              {/* 미리보기 이미지 */}
              {previousTreatsPics[index] && (
                <img
                  src={`${AUTH_URL}${previousTreatsPics[
                    index
                  ].treatsPic.replace("/local", "/treats/images")}`} // 이전 사진 URL 변환
                  alt={`대표 사진 ${index + 1}`}
                  className={styles.previewImage}
                />
              )}
            </div>
          ))}
          <button type="button" onClick={addTreatsPicInput}>
            대표 사진 추가
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>상세 사진</label>
          {treatsDetailPicsInputs.map((_, index) => (
            <div key={index}>
              <input
                type="file"
                className={styles.inputField}
                onChange={(e) => handleFileChange(e, "treatsDetailPics", index)}
                ref={(el) => (treatsDetailPicsInputRefs.current[index] = el)} // ref 추가
                multiple
              />
              {/* 미리보기 이미지 */}
              {previousTreatsDetailPics[index] && (
                <img
                  src={`${AUTH_URL}${previousTreatsDetailPics[
                    index
                  ].treatsDetailPic.replace("/local", "/treats/images")}`} // 이전 상세 사진 URL 변환
                  alt={`상세 사진 ${index + 1}`}
                  className={styles.previewImage}
                />
              )}
            </div>
          ))}
          <button type="button" onClick={addTreatsDetailPicInput}>
            상세 사진 추가
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          수정하기
        </button>
      </form>
    </div>
  );
};

export default EditTreat;
