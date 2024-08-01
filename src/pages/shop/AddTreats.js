import React, { useState } from "react";
import styles from "./AddTreats.module.scss";
import { allergiesOptions } from "../../components/auth/dog/DogAllergiesInput";
import { TREATS_URL } from "../../config/user/host-config";
import { getUserToken } from "../../config/user/auth";

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

  const token = getUserToken();

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
    setTreatsDetailPicsInputs([
      ...treatsDetailPicsInputs,
      treatsDetailPicsInputs.length,
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("treatsType", treatsType);
    formData.append("treatsWeight", treatsWeight);
    formData.append("dogSize", dogSize);
    formData.append("allergieList", selectedAllergies.join(","));

    treatsPics.forEach((file, index) => {
      if (file) {
        formData.append(`treatsPics[${index}].treatsPicFile`, file);
      }
    });

    // TreatsDetailPicDto 형태로 treatsDetailPics 파일 추가
    treatsDetailPics.forEach((file, index) => {
      if (file) {
        formData.append(`treatsDetailPics[${index}].treatsDetailPicFile`, file);
      }
    });

    try {
      const response = await fetch(`${TREATS_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`서버 응답이 올바르지 않습니다: ${errorMessage}`);
      }

      // 상품 추가 완료 후 입력창 초기화
      setTitle("");
      setTreatsType("");
      setTreatsWeight("");
      setDogSize("");
      setSelectedAllergies([]);
      setTreatsPics([]);
      setTreatsDetailPics([]);
      setTreatsPicsInputs([0]); // 초기값으로 한 개의 입력창 설정
      setTreatsDetailPicsInputs([0]); // 초기값으로 한 개의 입력창 설정

      alert("상품 추가 완료");
    } catch (error) {
      console.error("상품 추가 실패");

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
