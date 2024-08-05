import React, {useEffect, useState} from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyBoards.module.scss'
import {BOARD_URL} from "../../config/user/host-config";
import {useSelector} from "react-redux";

const MyBoards = () => {

    const userDetail = useSelector(state => state.userEdit.userDetail);
    const [data, setData] = useState([]);

    console.log(userDetail)

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
    console.log(data)

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 적은 게시글~
            </div>
        </div>
    );
};

export default MyBoards;