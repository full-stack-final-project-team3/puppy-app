import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./BoardDetailPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";
import { BsChat, BsEye, BsPerson } from "react-icons/bs";

const BoardDetailPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsLoggedIn(!!userData && !!userData.token);

    const fetchPostDetail = async () => {
      try {
        const headers = {};
        if (isLoggedIn) {
          headers.Authorization = `Bearer ${userData.token}`;
        }

        const response = await fetch(`${BOARD_URL}/${id}`, { headers });
        const data = await response.json();
        setPost(data);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetail();
  }, [id, isLoggedIn]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${BOARD_URL}/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")).token
          }`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!post) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.postDetailPage}>
      <h1 className={styles.postTitle}>{post.boardTitle}</h1>
      <div className={styles.postMeta}>
        <span className={styles.author}>
          <BsPerson /> {post.user?.name || "익명"}
        </span>
        <span className={styles.date}>
          {new Date(post.boardCreatedAt).toLocaleDateString()}
        </span>
        <span className={styles.viewCount}>
          <BsEye /> {post.viewCount}
        </span>
      </div>
      <div className={styles.postContent}>{post.boardContent}</div>
      {post.image && (
        <div className={styles.postImage}>
          <img src={post.image} alt={post.boardTitle} />
        </div>
      )}
      <div className={styles.commentsSection}>
        <h2>
          <BsChat /> 댓글
        </h2>
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력해주세요"
              required
            />
            <button type="submit">댓글 작성</button>
          </form>
        ) : (
          <p className={styles.loginPrompt}>
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
        )}
        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentContent}>
                <span className={styles.commentAuthor}>
                  {comment.user?.name || "익명"}
                </span>
                <span className={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <p>{comment.content}</p>
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <ul className={styles.replyList}>
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className={styles.replyItem}>
                      <span className={styles.replyAuthor}>
                        {reply.user?.name || "익명"}
                      </span>
                      <span className={styles.replyDate}>
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoardDetailPage;
