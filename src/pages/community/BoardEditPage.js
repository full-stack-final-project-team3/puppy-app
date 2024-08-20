import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BOARD_URL } from "../../config/user/host-config";
import styles from "./BoardEditPage.module.scss";
import { IoChevronBack } from "react-icons/io5";
import { GiDogHouse } from "react-icons/gi";

const BoardEditPage = () => {
  const [post, setPost] = useState({ boardTitle: "", boardContent: "" });
  const [newFiles, setNewFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(`${BOARD_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost({
          boardTitle: data.boardTitle,
          boardContent: data.boardContent,
        });
        setCurrentImages(data.images || []);
      } catch (error) {
        console.error("Error fetching post:", error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleImageDelete = (imageUrl) => {
    // 현재 이미지 배열에서 삭제할 이미지를 제거합니다.
    const updatedImages = currentImages.filter((img) => img !== imageUrl);
    setCurrentImages(updatedImages);

    // 삭제할 이미지를 별도의 배열에 추가합니다.
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const dto = {
      boardTitle: post.boardTitle,
      boardContent: post.boardContent,
      user: { id: user.id },
      imagesToDelete: imagesToDelete,
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    newFiles.forEach((file) => formData.append("newFiles", file));

    // 디버깅을 위해 formData 출력
    console.log([...formData]);

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

      // Redirect to the updated post
      navigate(`/board/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error (e.g., show error message to user)
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
          name="boardTitle"
          value={post.boardTitle}
          onChange={handleInputChange}
          placeholder="제목"
          className={styles.input}
          required
        />
        <textarea
          name="boardContent"
          value={post.boardContent}
          onChange={handleInputChange}
          placeholder="내용을 입력해주세요"
          className={styles.textarea}
          required
        />
        <div className={styles.currentImages}>
          <p>현재 이미지:</p>
          {currentImages.map((img, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={img}
                alt={`Current ${index}`}
                className={styles.thumbnails}
              />
              <button
                type="button"
                onClick={() => handleImageDelete(img)}
                className={styles.deleteImageButton}
              >
                삭제
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
            <p className={styles.fileName}>
              {newFiles.length} 개의 새 이미지 선택됨
            </p>
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
