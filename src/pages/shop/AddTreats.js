import React, { useState } from "react";
import styles from "./AddTreats.module.scss";
import { allergiesOptions } from "../../components/auth/dog/DogAllergiesInput";

const AddTreats = () => {
  const [title, setTitle] = useState("");
  const [treatsType, setTreatsType] = useState("");
  const [treatsWeight, setTreatsWeight] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [treatsPics, setTreatsPics] = useState([]);
  const [treatsDetailPics, setTreatsDetailPics] = useState([]);

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

  const handleFileChange = (event, type) => {
    const files = Array.from(event.target.files);
    if (type === "treatsPics") {
      setTreatsPics(files);
    } else {
      setTreatsDetailPics(files);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("treatsType", treatsType);
    formData.append("treatsWeight", treatsWeight);
    formData.append("dogSize", dogSize);
    formData.append("allergieList", selectedAllergies.join(","));

    treatsPics.forEach((file) => {
      formData.append("treatsPics", file);
    });

    treatsDetailPics.forEach((file) => {
      formData.append("treatsDetailPics", file);
    });

    try {
      const response = await fetch("/treats", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const data = await response.text(); // 또는 response.json() 필요에 따라
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
            // placeholder="g"
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
          <input
            type="file"
            multiple
            className={styles.inputField}
            onChange={(e) => handleFileChange(e, "treatsPics")}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>상세 사진</label>
          <input
            type="file"
            multiple
            className={styles.inputField}
            onChange={(e) => handleFileChange(e, "treatsDetailPics")}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          상품 등록
        </button>
      </form>
    </div>
  );
};

export default AddTreats;
