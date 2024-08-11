import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./BoardPostPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";

const BoardPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const user = useSelector((state) => state.userEdit.userDetail);
  console.log("👽user: " + user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const dto = {
      boardTitle: title,
      boardContent: content,
      user: { id: user.id },
    };

    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    images.forEach((image, index) => {
      formData.append(`files`, image);
    });

    console.log("☘️: " + formData);
    try {
      const response = await fetch(`${BOARD_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")).token
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
      // Handle error (e.g., show error message to user)
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className={styles.createPostPage}>
      <h1 className={styles.title}>새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
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
        <div className={styles.imageUpload}>
          <label htmlFor="image-upload" className={styles.imageLabel}>
            이미지 업로드
          </label>
          <input
            id="image-upload"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className={styles.imageInput}
          />
          {images.length > 0 && (
            <p className={styles.fileName}>
              {images.length} 개의 이미지 선택됨
            </p>
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
