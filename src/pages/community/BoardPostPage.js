import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./BoardPostPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";

const BoardPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Redux store에서 사용자 정보 가져오기
  const user = useSelector((state) => state.userEdit.userDetail);
  console.log("👽user: " + user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // JSON.stringify로 DTO 형식 생성
    const dto = {
      boardTitle: title,
      boardContent: content,
      image: image ? image.name : null,
      user: user, // 사용자 ID 추가
    };

    // FormData에 dto 추가
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    if (image) {
      formData.append("file", image);
    }

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
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
            className={styles.imageInput}
          />
          {image && <p className={styles.fileName}>{image.name}</p>}
        </div>
        <button type="submit" className={styles.submitButton}>
          게시글 작성
        </button>
      </form>
    </div>
  );
};

export default BoardPostPage;
