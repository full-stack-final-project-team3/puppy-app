import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./BoardDetailPage.module.scss";
import { BOARD_URL, NOTICE_URL } from "../../config/user/host-config";
import {
  BsChat,
  BsEye,
  BsPerson,
  BsImage,
  BsThreeDotsVertical,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { AiOutlineExport } from "react-icons/ai";
import { GoClock } from "react-icons/go";

const BASE_URL = "http://localhost:8888"; // 백엔드 URL을 여기에 정의

const BoardDetailPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsLoggedIn(!!userData && !!userData.token);
    fetchPostDetail();
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const headers = userData?.token
        ? { Authorization: `Bearer ${userData.token}` }
        : {};
      const response = await fetch(`${BOARD_URL}/${id}`, { headers });
      const data = await response.json();
      setPost(data);
      setComments(data.replies || []);
    } catch (error) {
      console.error("게시물 상세 정보를 가져오는 중 오류 발생:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append(
        "user",
        JSON.stringify({
          id: user.id,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
          email: user.email,
        })
      );
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch(`${BOARD_URL}/${id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPostData = await response.json();
      console.log("Updated post data:", updatedPostData);

      if (updatedPostData && updatedPostData.replies) {
        setPost(updatedPostData);
        setComments(updatedPostData.replies || []);
      } else {
        console.error(
          "Invalid data structure received from server:",
          updatedPostData
        );
        await fetchPostDetail();
      }

      setNewComment("");
      setNewImage(null);
      if (document.getElementById("imageUpload")) {
        document.getElementById("imageUpload").value = "";
      }
    } catch (error) {
      console.error("댓글을 제출하는 중 오류 발생:", error);
      alert("댓글 제출에 실패했습니다. 다시 시도해 주세요.");
    }

    if (user.id !== post.user.id) {
      const noticePayload = {
        userId: post.user.id,
        message: `'${user.nickname}'님께서 '${post.boardTitle}'글에 대한 댓글을 남기셨습니다.`,
      };
      const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticePayload),
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.boardTitle,
          text: post.boardContent,
          url: window.location.href,
        })
        .then(() => console.log("공유 성공"))
        .catch((error) => console.log("공유 오류:", error));
    } else {
      const url = window.location.href;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("URL이 클립보드에 복사되었습니다.");
        })
        .catch((error) => {
          console.error("클립보드 복사 오류:", error);
          alert("URL 복사에 실패했습니다. URL을 직접 복사하여 공유하세요.");
        });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(`${BOARD_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("게시물이 성공적으로 삭제되었습니다.");
          navigate("/board");
        } else {
          throw new Error("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error);
        alert("게시물 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/board/${id}/edit`);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (action) => {
    setShowOptions(false);
    if (action === "edit") {
      handleEdit();
    } else if (action === "delete") {
      handleDelete();
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!post) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.postDetailPage}>
      <h1 className={styles.postTitle}>{post.boardTitle}</h1>
      <div className={styles.postMeta}>
        <span className={styles.author}>
          <img
            className={styles.profileImage}
            src={post.user?.profileUrl || "/default-profile.png"}
            alt="프로필"
          />
          {post.user?.nickname || "익명의강아지주인"}
        </span>
        <span className={styles.date}>
          <GoClock className={styles.iconWithSpacing} />
          {new Date(post.boardCreatedAt).toLocaleDateString()}
        </span>
        <span className={styles.viewCount}>
          <BsEye className={styles.iconWithSpacing} /> {post.viewCount}
        </span>
        {isLoggedIn && user.id === post.user.id && (
          <div className={styles.optionsContainer}>
            <button className={styles.optionsButton} onClick={toggleOptions}>
              <BsThreeDotsVertical />
            </button>
          </div>
        )}
      </div>
      {post.images && post.images.length > 0 && (
        <div className={styles.postImages}>
          <img
            src={`${BASE_URL}${post.images[currentImageIndex]}`}
            alt={`${post.boardTitle} - 이미지 ${currentImageIndex + 1}`}
            className={styles.mainImage}
          />
          {post.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className={`${styles.imageNavButton} ${styles.prev}`} // 왼쪽 버튼
                aria-label="이전 이미지"
              >
                <BsChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className={`${styles.imageNavButton} ${styles.next}`} // 오른쪽 버튼
                aria-label="다음 이미지"
              >
                <BsChevronRight />
              </button>
              <div className={styles.imageCount}>
                {currentImageIndex + 1} / {post.images.length}
              </div>
            </>
          )}
        </div>
      )}
      <div className={styles.postContent}>{post.boardContent}</div>
      <div className={styles.shareButtonContainer}>
        <button className={styles.shareButton} onClick={handleShare}>
          <AiOutlineExport /> 공유하기
        </button>
      </div>
      <div className={styles.commentsSection}>
        <h2>
          <BsChat /> 댓글
        </h2>
        <ul className={styles.commentList}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <li
                key={comment.id || comment.replyId}
                className={styles.commentItem}
              >
                <div className={styles.commentContent}>
                  <span className={styles.commentAuthor}>
                    <img
                      className={styles.profileImage}
                      src={comment.user?.profileUrl || "/default-profile.png"}
                      alt="프로필"
                    />
                    {comment.user?.nickname || "익명의강아지주인"}
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(
                      comment.createdAt || comment.replyCreatedAt
                    ).toLocaleDateString()}
                  </span>
                  <p>{comment.content || comment.replyContent}</p>
                  {comment.imageUrl && (
                    <img
                      src={comment.imageUrl}
                      alt="댓글 이미지"
                      className={styles.commentImage}
                    />
                  )}
                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <ul className={styles.replyList}>
                    {comment.replies.map((reply) => (
                      <li
                        key={reply.id || reply.replyId}
                        className={styles.replyItem}
                      >
                        <span className={styles.replyAuthor}>
                          <img
                            className={styles.profileImage}
                            src={
                              reply.user?.profileUrl || "/default-profile.png"
                            }
                            alt="프로필"
                          />
                          {reply.user?.nickname || "익명의강아지주인"}
                        </span>
                        <span className={styles.replyDate}>
                          {new Date(
                            reply.createdAt || reply.replyCreatedAt
                          ).toLocaleDateString()}
                        </span>
                        <p>{reply.content || reply.replyContent}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li>댓글이 없습니다.</li>
          )}
        </ul>
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                required
                className={styles.commentInput}
              />
              <label htmlFor="imageUpload" className={styles.iconButton}>
                <BsImage />
              </label>
              <input
                id="imageUpload"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              {newImage && (
                <span className={styles.imageSelected}>이미지 선택됨</span>
              )}
              <button type="submit" className={styles.submitButton}>
                등록
              </button>
            </div>
          </form>
        ) : (
          <p className={styles.loginPrompt}>
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
        )}
      </div>
      {showOptions && (
        <>
          <div
            className={`${styles.optionsOverlay} ${
              showOptions ? styles.active : ""
            }`}
            onClick={toggleOptions}
          ></div>
          <div
            className={`${styles.optionsMenu} ${
              showOptions ? styles.active : ""
            }`}
          >
            <button onClick={() => handleOptionClick("edit")}>수정</button>
            <button onClick={() => handleOptionClick("delete")}>삭제</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardDetailPage;
