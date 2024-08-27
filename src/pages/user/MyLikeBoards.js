import React, {useEffect, useState} from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeBoards.module.scss'
import {AUTH_URL} from "../../config/user/host-config";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {BsChat, BsEye, BsPerson} from "react-icons/bs";
import Footer from '../../layout/user/Footer';

const MyBoards = () => {

    const user = useSelector(state => state.userEdit.userDetail);
    const [data, setData] = useState([]);


    // 좋아요 누른 글들
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${AUTH_URL}/board/like/${user.id}`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user.id]);

    return (
        <>
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                {data.length > 0 ?
                    <>
                        <h1 className={styles.h1}>좋아요 누른 게시글</h1>
                        <ul className={styles.postList}>
                            {data.map((post) => (
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
                        <BsPerson/> {post.user.nickname}
                      </span>

                                                <span className={styles.date}>
                        {new Date(post.boardCreatedAt).toLocaleDateString()}
                      </span>
                                                <span className={styles.comments}>
                        <BsChat/> {post.replyCount || 0}
                      </span>
                                                <span className={styles.viewCount}>
                        <BsEye/> {post.viewCount}
                      </span>
                                            </div>
                                        </div>
                                        {post.image && (
                                            <div className={styles.postImage}>
                                                <img src={post.image} alt={post.boardTitle}/>
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>

                    :
                    <>
                        <h1 className={styles.h1}>좋아요 누른 게시글</h1>
                        <p className={styles.noLike}>좋아요 누른 글이 없습니다.</p>
                    </>
                }

            </div>
        </div>

        <Footer />
        </>
    );
};

export default MyBoards;