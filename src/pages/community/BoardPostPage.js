import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./BoardPostPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";
import { IoChevronBack } from "react-icons/io5";
import { GiDogHouse } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import {getUserToken} from "../../config/user/auth";

const BoardPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [labelColor, setLabelColor] = useState(styles.imageLabelInactive);

  const user = useSelector((state) => state.userEdit.userDetail);
  // console.log("👽user: " + user.email);

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
      // Handle error (e.g., show error message to user)
    }
  };

const handleImageChange = (e) => {
  if (e.target.files) {
    const newImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newImages]);

    // 이미지가 추가될 때 색상 변경
    setLabelColor(styles.imageLabelActive);
  }
};

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // 이미지 수가 0이 되면 색상을 회색으로 변경
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
            style={{ display: "none" }} // 파일 선택 버튼 숨기기
          />
          {/* <button
            type="button"
            onClick={() => document.getElementById("image-upload").click()} // 이미지 업로드 버튼 클릭
            className={styles.imageUploadButton}
          >
            이미지 선택
          </button> */}
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
