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
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const user = useSelector((state) => state.userEdit.userDetail);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsAdmin(userData?.role === "ADMIN");
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch(`${BOARD_URL}/keywords`);
      if (response.ok) {
        const data = await response.json();
        setKeywords([{ id: null, name: "전체" }, ...data]);
      }
    } catch (error) {
      console.error("키워드 불러오기 실패:", error);
    }
  };

  const handleKeywordDelete = async (keywordId) => {
    if (
      window.confirm(
        "이 키워드를 삭제하시겠습니까? 관련 게시글의 키워드 참조가 제거됩니다."
      )
    ) {
      try {
        const response = await fetch(`${BOARD_URL}/keywords/${keywordId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userData")).token
            }`,
          },
        });
        if (response.ok) {
          // 키워드 목록에서 삭제된 키워드 제거
          setKeywords((prevKeywords) =>
            prevKeywords.filter((k) => k.id !== keywordId)
          );

          // 현재 표시 중인 게시글 목록에서 해당 키워드 제거
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              if (post.keyword && post.keyword.id === keywordId) {
                return { ...post, keyword: null };
              }
              return post;
            })
          );

          // 선택된 키워드가 삭제된 키워드인 경우, 선택 해제
          if (selectedKeyword === keywordId) {
            setSelectedKeyword(null);
            // 모든 게시글을 다시 불러오기
            setPage(1);
            setPosts([]);
            setIsAllLoaded(false);
            fetchPosts();
          }

          alert("키워드가 성공적으로 삭제되었습니다.");
        } else {
          const errorData = await response.json();
          alert(
            `키워드 삭제에 실패했습니다: ${
              errorData.message || "알 수 없는 오류가 발생했습니다."
            }`
          );
        }
      } catch (error) {
        console.error("키워드 삭제 중 오류 발생:", error);
        alert("키워드 삭제 중 오류가 발생했습니다.");
      }
    }
  };

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
        } else if (selectedKeyword) {
          url = `${BOARD_URL}/keyword/${selectedKeyword}?sort=boardCreatedAt&page=${page}&limit=10`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`서버 오류! 상태 코드: ${response.status}`);
        }

        const newPosts = await response.json();

        if (newPosts.length === 0) {
          setIsAllLoaded(true);
        } else {
          setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts, ...newPosts];
            const uniquePosts = Array.from(
              new Set(updatedPosts.map((post) => post.id))
            ).map((id) => updatedPosts.find((post) => post.id === id));
            return uniquePosts;
          });
          setPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error("🐶 게시글 가져오기 오류:", error.message);
        setIsAllLoaded(true);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, isAllLoaded, selectedKeyword]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
    setIsSearching((prev) => {
      if (prev) {
        setFilteredPosts([]);
        setPage(1);
        setIsAllLoaded(false);
        fetchPosts();
      }
      return !prev;
    });
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSearch(newSearchTerm);
  };

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (term === lastSearchTerm) return;

      setLastSearchTerm(term);
      setPage(1);
      setIsAllLoaded(false);
      setPosts([]);

      if (term) {
        await fetchPosts(term);
        setFilteredPosts(
          posts.filter((post) =>
            post.boardTitle.toLowerCase().includes(term.toLowerCase())
          )
        );
      } else {
        await fetchPosts();
        setFilteredPosts([]);
      }
    }, 300),
    [fetchPosts, lastSearchTerm]
  );

  const handleKeywordSubmit = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    try {
      const response = await fetch(`${BOARD_URL}/keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")).token
          }`,
        },
        body: JSON.stringify({ name: newKeyword }),
      });

      if (response.ok) {
        alert("키워드가 성공적으로 등록되었습니다.");
        setNewKeyword("");
        fetchKeywords(); // 키워드 목록 새로고침
      } else {
        alert("키워드 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("키워드 등록 중 오류 발생:", error);
      alert("키워드 등록 중 오류가 발생했습니다.");
    }
  };

  const handleKeywordClick = (keywordId) => {
    setSelectedKeyword(keywordId);
    setPage(1);
    setPosts([]);
    setIsAllLoaded(false);
    fetchPosts();
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
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
        <div>
          {isAdmin && (
            <form onSubmit={handleKeywordSubmit} className={styles.keywordForm}>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="새 키워드 입력"
                className={styles.keywordInput}
              />
              <button type="submit" className={styles.keywordSubmit}>
                등록
              </button>
            </form>
          )}
        </div>
        <div className={styles.keywordsContainer}>
          {keywords.map((keyword) => (
            <span
              key={keyword.id}
              className={`${styles.keywordLabel} ${
                selectedKeyword === keyword.id ? styles.selected : ""
              }`}
              onClick={() => handleKeywordClick(keyword.id)}
            >
              {keyword.name}
              {isAdmin && keyword.id !== null && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeywordDelete(keyword.id);
                  }}
                  className={styles.keywordDeleteBtn}
                >
                  X
                </button>
              )}
            </span>
          ))}
        </div>

        {displayPosts.length === 0 && !loading ? (
          <div className={styles.noPosts}>게시글이 없습니다!</div>
        ) : (
          <ul className={styles.postList}>
            {displayPosts.map((post) => (
              <li key={`${post.id}`} className={styles.postItem}>
                <Link to={`/board/${post.id}`} className={styles.postLink}>
                  <div className={styles.postContent}>
                    <h2 className={styles.postTitle}>
                      {post.keyword && (
                        <span className={styles.keywordLabel}>
                          {post.keyword.name}
                        </span>
                      )}
                      {post.boardTitle}
                    </h2>
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
