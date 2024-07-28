import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./BoardPage.module.scss";
import { BOARD_URL } from "../../config/user/host-config"; // Import BOARD_URL from the correct location

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

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

      const newPosts = await response.json();
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts]
  );

  return (
    <div className={styles.boardPage}>
      <h1 className={styles.title}>커뮤니티</h1>
      <ul className={styles.postList}>
        {posts.map((post, index) => (
          <li
            key={post.id}
            className={styles.postItem}
            ref={index === posts.length - 1 ? lastPostElementRef : null}
          >
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
                  댓글{post.replies?.length || 0}
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
          </li>
        ))}
      </ul>
      {loading && <div className={styles.loading}>Loading...</div>}
    </div>
  );
};

export default BoardPage;
