import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BOARD_URL, BASE_URL } from "../../config/user/host-config"; // BASE_URL 추가
import styles from "./BoardEditPage.module.scss";
import { IoChevronBack } from "react-icons/io5";
import { GiDogHouse } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import {userDataLoader} from "../../config/user/auth";

const BoardEditPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userData = userDataLoader();
        const response = await fetch(`${BOARD_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setTitle(data.boardTitle);
        setContent(data.boardContent);
        setCurrentImages(data.images || []);
        setSelectedKeyword(data.keyword?.id || null); // 게시물의 키워드 설정
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  // 키워드 가져오기
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch(`${BOARD_URL}/keywords`);
        if (response.ok) {
          const data = await response.json();
          setKeywords(data);
        }
      } catch (error) {
        console.error("키워드 가져오기 실패:", error);
      }
    };

    fetchKeywords();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleImageDelete = async (imageUrl) => {
    const updatedImages = currentImages.filter((img) => img !== imageUrl);
    setCurrentImages(updatedImages);
    setImagesToDelete((prev) => [...prev, imageUrl]);


    // 서버에 삭제 요청 보내기
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(
        `${BOARD_URL}/${id}/deleteImage?imageUrl=${encodeURIComponent(
          imageUrl
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete image");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

const selectedKeywordObject = keywords.find(
  (keyword) => keyword.id === selectedKeyword
);


    const dto = {
      boardTitle: title,
      boardContent: content,
      user: { id: user.id },
      imagesToDelete: imagesToDelete,
      keyword: selectedKeywordObject
        ? { id: selectedKeywordObject.id, name: selectedKeywordObject.name }
        : null,
    };

    console.log("🐶dto: " + dto);
    console.log("🐶keyword: " + dto.keyword);
    console.log("🐶Selected Keyword ID:", selectedKeyword);
    console.log("🐶Selected Keyword Object:", selectedKeywordObject);
    
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    newFiles.forEach((file) => {
      formData.append("newFiles", file);
    });

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(`${BOARD_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update post");

      // 게시글 수정 후 남은 이미지를 업데이트
      const updatedData = await response.json();
      setCurrentImages(updatedData.images); // 서버에서 받은 남은 이미지들로 업데이트

      navigate(`/board/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };


  return (
    <div className={styles.editPostPage}>
      <div className={styles.headerNav}>
        <button
          onClick={() => navigate(`/board/${id}`)}
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
      <h1 className={styles.title}>게시글 수정</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleInputChange}
          placeholder="제목"
          className={styles.input}
          required
        />
        <textarea
          name="content"
          value={content}
          onChange={handleInputChange}
          placeholder="내용을 입력해주세요"
          className={styles.textarea}
          required
        />

        {/* 키워드 선택 */}
        <div className={styles.keywordSection}>
          <label htmlFor="keyword-select" className={styles.keywordLabel}>
            키워드 선택:
          </label>
          <div className={styles.keywordSelectWrapper}>
            <select
              id="keyword-select"
              value={selectedKeyword || ""}
              onChange={(e) => setSelectedKeyword(Number(e.target.value))}
              className={styles.keywordSelect}
            >
              <option value="">키워드를 선택하세요</option>
              {keywords.map((keyword) => (
                <option key={keyword.id} value={keyword.id}>
                  {keyword.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p>현재 이미지:</p>
        <div className={styles.currentImages}>
          {currentImages.map((img, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={`${BASE_URL}${img}`} // BASE_URL과 결합
                alt={`Current ${index}`}
                className={styles.thumbnails}
              />
              <button
                type="button"
                onClick={() => handleImageDelete(img)}
                className={styles.deleteImageButton}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
        <div className={styles.imageUpload}>
          <label htmlFor="image-upload" className={styles.imageLabel}>
            새 이미지 업로드
          </label>
          <input
            id="image-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className={styles.imageInput}
          />
          {newFiles.length > 0 && (
            <div className={styles.imagePreview}>
              {newFiles.map((file, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Image ${index}`}
                    className={styles.image}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewFiles((prev) => prev.filter((_, i) => i !== index));
                    }}
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
          게시글 수정
        </button>
      </form>
    </div>
  );
};

export default BoardEditPage;
