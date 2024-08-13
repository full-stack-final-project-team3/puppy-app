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
  BsReply,
} from "react-icons/bs";
import { AiOutlineExport } from "react-icons/ai";
import { GoClock } from "react-icons/go";

const BASE_URL = "http://localhost:8888";

const BoardDetailPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [newSubReply, setNewSubReply] = useState("");
  const [newSubReplyImage, setNewSubReplyImage] = useState(null);

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

  const handleCommentEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleCommentUpdate = async (commentId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(`${BOARD_URL}/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          content: editedCommentContent,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const updatedBoardData = await response.json();
        setPost(updatedBoardData);
        setComments(updatedBoardData.replies || []);
        setEditingCommentId(null);
        setEditedCommentContent("");
      } else {
        throw new Error("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      alert("댓글 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch(
          `${BOARD_URL}/${id}/comments/${commentId}?userId=${user.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (response.ok) {
          setComments(comments.filter((comment) => comment.id !== commentId));
        } else {
          throw new Error("댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  //대댓글 작성
  const handleSubReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("답글을 작성하려면 로그인이 필요합니다.");
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const formData = new FormData();
      formData.append("subReplyContent", newSubReply); // 'content' 대신 'subReplyContent' 사용
      formData.append(
        "user",
        JSON.stringify({
          id: user.id,
          nickname: user.nickname,
          profileUrl: user.profileUrl,
          email: user.email,
        })
      );
      if (newSubReplyImage) {
        formData.append("image", newSubReplyImage);
      }

      const response = await fetch(
        `${BOARD_URL}/${id}/comments/${commentId}/subReplies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newSubReplyData = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                subReplies: [
                  ...(comment.subReplies || []),
                  {
                    ...newSubReplyData,
                    user: {
                      id: user.id,
                      nickname: user.nickname,
                      profileUrl: user.profileUrl,
                      email: user.email,
                    },
                    subReplyCreatedAt: new Date().toISOString(), // 'createdAt' 대신 'subReplyCreatedAt' 사용
                  },
                ],
              }
            : comment
        )
      );

      setNewSubReply("");
      setNewSubReplyImage(null);
      setReplyingTo(null);
      if (document.getElementById("subReplyImageUpload")) {
        document.getElementById("subReplyImageUpload").value = "";
      }
    } catch (error) {
      console.error("답글을 제출하는 중 오류 발생:", error);
      alert("답글 제출에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  //대댓글 이미지 추가
  const handleSubReplyImageChange = (e) => {
    if (e.target.files[0]) {
      setNewSubReplyImage(e.target.files[0]);
    }
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
                className={`${styles.imageNavButton} ${styles.prev}`}
                aria-label="이전 이미지"
              >
                <BsChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className={`${styles.imageNavButton} ${styles.next}`}
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
              <li key={comment.id} className={styles.commentItem}>
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
                    {new Date(comment.replyCreatedAt).toLocaleDateString()}
                  </span>
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editedCommentContent}
                        onChange={(e) =>
                          setEditedCommentContent(e.target.value)
                        }
                        className={styles.editCommentTextarea}
                      />
                      <button
                        onClick={() => handleCommentUpdate(comment.id)}
                        className={styles.updateCommentButton}
                      >
                        완료
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className={styles.cancelEditButton}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p>{comment.replyContent}</p>
                  )}
                  {comment.imageUrl && (
                    <img
                      src={comment.imageUrl}
                      alt="댓글 이미지"
                      className={styles.commentImage}
                    />
                  )}
                  {user && user.id === comment.user?.id && (
                    <div className={styles.commentActions}>
                      <button
                        onClick={() =>
                          handleCommentEdit(comment.id, comment.replyContent)
                        }
                        className={styles.editCommentButton}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className={styles.deleteCommentButton}
                      >
                        삭제
                      </button>
                    </div>
                  )}

                  {/* 답글 버튼 */}
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className={styles.replyButton}
                  >
                    <BsReply /> 답글
                  </button>

                  {/* 대댓글 목록 */}
                  {comment.subReplies && comment.subReplies.length > 0 && (
                    <ul className={styles.subReplyList}>
                      {comment.subReplies.map((subReply) => (
                        <li key={subReply.id} className={styles.subReplyItem}>
                          <span className={styles.subReplyAuthor}>
                            <img
                              className={styles.profileImage}
                              src={
                                subReply.user?.profileUrl ||
                                "/default-profile.png"
                              }
                              alt="프로필"
                            />
                            {subReply.user?.nickname || "익명의강아지주인"}
                          </span>
                          <span className={styles.subReplyDate}>
                            {new Date(
                              subReply.subReplyCreatedAt
                            ).toLocaleString()}
                          </span>
                          <p>{subReply.subReplyContent}</p>
                          {subReply.imageUrl && (
                            <img
                              src={subReply.imageUrl}
                              alt="대댓글 이미지"
                              className={styles.subReplyImage}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 대댓글 입력 폼 */}
                  {replyingTo === comment.id && (
                    <form
                      onSubmit={(e) => handleSubReplySubmit(e, comment.id)}
                      className={styles.subReplyForm}
                    >
                      <div className={styles.inputWrapper}>
                        <input
                          type="text"
                          value={newSubReply}
                          onChange={(e) => setNewSubReply(e.target.value)}
                          placeholder="답글을 입력하세요"
                          required
                          className={styles.subReplyInput}
                        />
                        <label
                          htmlFor="subReplyImageUpload"
                          className={styles.iconButton}
                        >
                          <BsImage />
                        </label>
                        <input
                          id="subReplyImageUpload"
                          type="file"
                          onChange={handleSubReplyImageChange}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        {newSubReplyImage && (
                          <span className={styles.imageSelected}>
                            이미지 선택됨
                          </span>
                        )}
                        <button type="submit" className={styles.submitButton}>
                          등록
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className={styles.cancelButton}
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  )}
                </div>
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
