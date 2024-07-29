import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./BoardPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config";

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef();

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${BOARD_URL}?sort=date&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userData")).token
            }`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPosts = await response.json();
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          const uniquePosts = newPosts.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          );
          return [...prevPosts, ...uniquePosts];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      console.log("Rendering completed");
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && !loading && hasMore) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight > scrollHeight * 0.95) {
          fetchPosts();
        }
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, fetchPosts]);

  const handleWritePost = () => {
    console.log("게시글 작성 버튼 클릭");
  };

  return (
    <div className={styles.boardPage} ref={scrollRef}>
      <h1 className={styles.title}>커뮤니티</h1>
      {posts.length === 0 && !loading && !hasMore ? (
        <div className={styles.noPosts}>게시글이 없습니다!</div>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <Link to={`/board/${post.id}`} className={styles.postLink}>
                <div className={styles.postContent}>
                  <span className={styles.category}>{post.category}</span>
                  <h2 className={styles.postTitle}>{post.boardTitle}</h2>
                  <p className={styles.postExcerpt}>{post.boardContent}</p>
                  <div className={styles.postMeta}>
                    <span className={styles.author}>
                      {post.user?.name || "익명"}
                    </span>
                    <span className={styles.date}>
                      {new Date(post.boardCreatedAt).toLocaleDateString()}
                    </span>
                    <span className={styles.comments}>
                      댓글 {post.replies?.length || 0}
                    </span>
                  </div>
                </div>
                {post.image && (
                  <div className={styles.postImage}>
                    <img src={post.image} alt={post.boardTitle} />
                  </div>
                )}
                <div className={styles.viewCount}>
                  👀
                  <br /> {post.viewCount}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {loading && <div className={styles.loading}>Loading...</div>}
      {!hasMore && posts.length > 0 && (
        <div className={styles.endMessage}>모든 게시글을 불러왔습니다.</div>
      )}
      <button className={styles.writeButton} onClick={handleWritePost}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>글쓰기</span>
      </button>
    </div>
  );
};

export default BoardPage;
