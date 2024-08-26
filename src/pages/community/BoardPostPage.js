import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./BoardPostPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";
import { IoChevronBack } from "react-icons/io5";
import { GiDogHouse } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import {getUserToken} from "../../config/user/auth";

import { FaChevronDown } from "react-icons/fa";

const BoardPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(""); // 선택된 키워드 추가
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const [labelColor, setLabelColor] = useState(styles.imageLabelInactive);
  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch(`${BOARD_URL}/keywords`);
      if (response.ok) {
        const data = await response.json();
        setKeywords(data);
      }
    } catch (error) {
      console.error("키워드 불러오기 실패:", error);
    }
  };

  const handleKeywordSelect = (keyword) => {
    setSelectedKeyword(keyword);
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords((prev) => [...prev, keyword]);
    }
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const dto = {
      boardTitle: title,
      boardContent: content,
      user: { id: user.id },
      keyword: selectedKeyword ? { id: selectedKeyword.id } : null,
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    images.forEach((image) => {
      formData.append(`files`, image);
    });

    try {
      const token = getUserToken();

      const response = await fetch(`${BOARD_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            token
          }`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/board");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);
      setLabelColor(styles.imageLabelActive);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (newImages.length === 0) {
      setLabelColor(styles.imageLabelInactive);
    }
  };

  return (
    <div className={styles.createPostPage}>
      <div className={styles.headerNav}>
        <button
          onClick={() => navigate("/board")}
          className={styles.backButton}
        >
          <IoChevronBack />
        </button>
        <h1 className={styles.postTitle} onClick={() => navigate("/board")}>
          커뮤니티
        </h1>
        <button onClick={() => navigate("/")} className={styles.homeButton}>
          <GiDogHouse />
        </button>
      </div>
      <h1 className={styles.title}>새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={styles.input}
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력해주세요"
          className={styles.textarea}
          required
        />

        {/* 여기에 키워드 선택 부분 추가 */}
        <div className={styles.keywordSection}>
          <h3 className={styles.keywordTitle}>키워드 선택</h3>
          <div className={styles.keywordList}>
            {keywords.map((keyword) => (
              <button
                key={keyword.id}
                type="button"
                className={`${styles.keywordButton} ${
                  selectedKeyword && selectedKeyword.id === keyword.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleKeywordSelect(keyword)}
              >
                {keyword.name}
              </button>
            ))}
          </div>
          {selectedKeyword && (
            <p className={styles.selectedKeywordText}>
              선택된 키워드: <span>{selectedKeyword.name}</span>
            </p>
          )}
        </div>

        <label
          htmlFor="image-upload"
          className={`${styles.imageLabel} ${labelColor}`}
        >
          이미지 업로드 ({images.length})
        </label>
        <div className={styles.imageUpload}>
          <input
            id="image-upload"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className={styles.imageInput}
            style={{ display: "none" }}
          />
          {images.length > 0 && (
            <div className={styles.imagePreview}>
              {images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index}`}
                    className={styles.image}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(index)}
                    className={styles.deleteButton}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className={styles.submitButton}>
          게시글 작성
        </button>
      </form>
    </div>
  );
};

export default BoardPostPage;
