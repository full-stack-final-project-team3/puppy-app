import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BOARD_URL } from "../../config/user/host-config";
import styles from "./BoardEditPage.module.scss";

const BoardEditPage = () => {
  const [post, setPost] = useState({ boardTitle: "", boardContent: "" });
  const [files, setFiles] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BOARD_URL}/${id}`);
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
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const dto = {
      boardTitle: post.boardTitle,
      boardContent: post.boardContent,
      user: { id: user.id },
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    files.forEach((file) => formData.append("files", file));

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
            <img
              key={index}
              src={img}
              alt={`Current ${index}`}
              className={styles.thumbnails}
            />
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
          {files.length > 0 && (
            <p className={styles.fileName}>
              {files.length} 개의 새 이미지 선택됨
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
