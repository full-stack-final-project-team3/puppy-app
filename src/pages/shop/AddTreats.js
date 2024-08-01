import React, { useState } from "react";
import styles from "./AddTreats.module.scss";
import { allergiesOptions } from "../../components/auth/dog/DogAllergiesInput";
import { TREATS_URL } from "../../config/user/host-config";

const AddTreats = () => {
  const [title, setTitle] = useState("");
  const [treatsType, setTreatsType] = useState("");
  const [treatsWeight, setTreatsWeight] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [treatsPics, setTreatsPics] = useState([]);
  const [treatsDetailPics, setTreatsDetailPics] = useState([]);
  const [treatsPicsInputs, setTreatsPicsInputs] = useState([0]); // 대표 사진 파일 입력 필드
  const [treatsDetailPicsInputs, setTreatsDetailPicsInputs] = useState([0]); // 상세 사진 파일 입력 필드

  const handleAllergyChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedAllergies([...selectedAllergies, value]);
    } else {
      setSelectedAllergies(
        selectedAllergies.filter((allergy) => allergy !== value)
      );
    }
  };



  const handleFileChange = (event, type, index) => {
    const files = Array.from(event.target.files);
    if (type === "treatsPics") {
      const newTreatsPics = [...treatsPics];
      newTreatsPics[index] = files[0]; // 첫 번째 파일만 저장
      setTreatsPics(newTreatsPics);
    } else {
      const newTreatsDetailPics = [...treatsDetailPics];
      newTreatsDetailPics[index] = files[0]; // 첫 번째 파일만 저장
      setTreatsDetailPics(newTreatsDetailPics);
    }
  };

  const addTreatsPicInput = () => {
    setTreatsPicsInputs([...treatsPicsInputs, treatsPicsInputs.length]);
  };

  const addTreatsDetailPicInput = () => {
    setTreatsDetailPicsInputs([...treatsDetailPicsInputs, treatsDetailPicsInputs.length]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("treats-title", title);
    formData.append("treats-type", treatsType);
    formData.append("treats-weight", treatsWeight);
    formData.append("dog-size", dogSize);
    formData.append("treats-allergy", selectedAllergies.join(","));

    treatsPics.forEach((file) => {
      if (file) {
        formData.append("treats-pics", file);
      }
    });

    treatsDetailPics.forEach((file) => {
      if (file) {
        formData.append("treats-detail-pics", file);
      }
    });

    try {
      const response = await fetch(`${TREATS_URL}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // 필요한 경우 토큰을 추가
      },
        body: formData,
      });

      console.log(response)

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const data = await response.json(); // 또는 response.json() 필요에 따라
      alert(data); // 성공 메시지
    } catch (error) {
      console.error("상품 추가 실패:", error);
      alert("상품 추가에 실패했습니다.");
    }
  };

  return (
    <div className={styles.addTreats}>
      <h2>상품 추가</h2>
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
            <option value="WET">습식</option>
            <option value="DRY">건식</option>
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
          <label className={styles.label}>상품 대상 강아지 사이즈</label>
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
            <input
              key={index}
              type="file"
              className={styles.inputField}
              onChange={(e) => handleFileChange(e, "treatsPics", index)}
              required
            />
          ))}
          <button type="button" onClick={addTreatsPicInput}>
            추가 사진
          </button>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>상세 사진</label>
          {treatsDetailPicsInputs.map((_, index) => (
            <input
              key={index}
              type="file"
              className={styles.inputField}
              onChange={(e) => handleFileChange(e, "treatsDetailPics", index)}
              required
            />
          ))}
          <button type="button" onClick={addTreatsDetailPicInput}>
            추가 사진
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
          상품 등록
        </button>
      </form>
    </div>
  );
};

export default AddTreats;
