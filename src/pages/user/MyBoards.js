import React, {useEffect, useState} from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyBoards.module.scss'
import {BOARD_URL} from "../../config/user/host-config";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {BsChat, BsEye, BsPerson} from "react-icons/bs";
import Footer from '../../layout/user/Footer';

const MyBoards = () => {

    const userDetail = useSelector(state => state.userEdit.userDetail);
    const [data, setData] = useState([]);



    useEffect(() => {
        const fetchList = async () => {
            if (!userDetail.id) return; // userDetail.id가 존재하지 않을 때 방지

            const response = await fetch(`${BOARD_URL}/boardList/${userDetail.id}`);
            if (response.ok) {
                const result = await response.json();
                setData(result);
            }
        };

        fetchList();
    }, [userDetail.id]);


    return (
        <>
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                {data.length > 0 ?
                    <>
                        <h1 className={styles.h1}>{userDetail.nickname}님의 게시글</h1>
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
                                                    src={userDetail.profileUrl}
                                                    alt="Profile"
                                                />
                                                <span className={styles.author}>
                        <BsPerson/> {userDetail.nickname}
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
                        <h1 className={styles.h1}>{userDetail.nickname}님의 게시글</h1>
                        <p className={styles.noBoard}>등록된 게시글이 없습니다.</p>
                    </>
                }

            </div>
        </div>

        <Footer />
        </>
    );
};

export default MyBoards;