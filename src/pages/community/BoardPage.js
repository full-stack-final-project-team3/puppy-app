import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./BoardPage.module.scss";
import { BOARD_URL, BASE_URL } from "../../config/user/host-config";
import { useSelector } from "react-redux";
import { BsChat, BsEye, BsPerson, BsImages, BsSearch } from "react-icons/bs";
import { HiOutlineHeart } from "react-icons/hi2";

import FixedButtons from "../../components/community/FixedButtons";

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const scrollRef = useRef();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  const user = useSelector((state) => state.userEdit.userDetail);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchPosts = useCallback(
    async (searchKeyword = "") => {
      if (loading || isAllLoaded) return;
      setLoading(true);
      try {
        let url = `${BOARD_URL}?sort=boardCreatedAt&page=${page}&limit=10`;
        if (searchKeyword) {
          url = `${BOARD_URL}/search?keyword=${searchKeyword}&page=${page}&limit=10`;
        }
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`서버 오류! 상태 코드: ${response.status}`);
        }

        const newPosts = await response.json();
        if (newPosts.length === 0) {
          setIsAllLoaded(true);
        } else {
          const updatedPosts = searchKeyword ? filteredPosts : posts;
          const existingPostIds = new Set(updatedPosts.map((post) => post.id));
          const uniquePosts = newPosts.filter(
            (post) => !existingPostIds.has(post.id)
          );

          if (uniquePosts.length === 0) {
            setIsAllLoaded(true);
          } else {
            if (searchKeyword) {
              setFilteredPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
            } else {
              setPosts((prevPosts) => [...prevPosts, ...uniquePosts]);
            }
            setPage((prevPage) => prevPage + 1);
          }
        }
      } catch (error) {
        console.error("게시글 가져오기 오류:", error.message);
        setIsAllLoaded(true);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, posts, filteredPosts, isAllLoaded]
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!loading && !isAllLoaded) {
          fetchPosts(searchTerm);
        }
      }
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isAllLoaded, fetchPosts, searchTerm]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleWritePost = () => {
    if (user) {
      navigate("/board/create");
    } else {
      alert("글을 작성하려면 로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return new Date(date).toLocaleDateString();
    } else if (diffInHours > 0) {
      return `${diffInHours}시간 전`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}분 전`;
    } else {
      return "방금 전";
    }
  };

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm("");
      setFilteredPosts([]);
      setPage(1);
      setIsAllLoaded(false);
      fetchPosts();
    }
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (term) {
        setPage(1);
        setFilteredPosts([]);
        setIsAllLoaded(false);
        await fetchPosts(term);
      } else {
        setFilteredPosts([]);
        setPage(1);
        setIsAllLoaded(false);
        fetchPosts();
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const displayPosts = searchTerm ? filteredPosts : posts;

  return (
    <div className={styles.boardPageWrapper}>
      <div className={styles.boardPage} ref={scrollRef}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>커뮤니티</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="검색할 제목 입력"
              value={searchTerm}
              onChange={handleSearchChange}
              className={`${styles.searchInput} ${
                isSearching ? styles.active : ""
              }`}
            />
            <BsSearch
              className={styles.searchIcon}
              onClick={handleSearchClick}
            />
          </div>
        </div>

        {displayPosts.length === 0 && !loading ? (
          <div className={styles.noPosts}>게시글이 없습니다!</div>
        ) : (
          <ul className={styles.postList}>
            {displayPosts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <Link to={`/board/${post.id}`} className={styles.postLink}>
                  <div className={styles.postContent}>
                    <h2 className={styles.postTitle}>{post.boardTitle}</h2>
                    <p className={styles.postExcerpt}>{post.boardContent}</p>
                    <div className={styles.postMeta}>
                      <img
                        className={styles.image}
                        src={post.user.profileUrl}
                        alt="Profile"
                      />
                      <span className={styles.author}>
                        <BsPerson /> {post.user.nickname || "익명의강아지주인"}
                      </span>
                      <span className={styles.date}>
                        {formatTimeAgo(post.boardCreatedAt)}
                      </span>
                      <span className={styles.comments}>
                        <BsChat /> {post.replyCount || 0}
                      </span>
                      <span className={styles.viewCount}>
                        <BsEye /> {post.viewCount}
                      </span>
                      <span className={styles.likes}>
                        <HiOutlineHeart /> {post.likeCount}
                      </span>
                    </div>
                  </div>
                  {post.images && post.images.length > 0 && (
                    <div className={styles.postImage}>
                      <img
                        src={`${BASE_URL}${post.images[0]}`}
                        alt={post.boardTitle}
                      />
                      {post.images.length > 1 && (
                        <div className={styles.imageCount}>
                          <BsImages /> +{post.images.length - 1}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {loading && <div className={styles.loading}>Loading...</div>}
        {isAllLoaded && displayPosts.length > 0 && (
          <div className={styles.endMessage}>모든 게시글을 불러왔습니다.</div>
        )}

        <FixedButtons
          onScrollTop={scrollToTop}
          onWrite={handleWritePost}
          showScrollTop={showScrollTop}
        />
      </div>
    </div>
  );
};

export default BoardPage;
