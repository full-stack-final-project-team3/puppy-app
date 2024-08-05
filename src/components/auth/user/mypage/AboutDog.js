import React, { useEffect } from 'react';
import styles from './AboutDog.module.scss';
import { Link, useLocation } from "react-router-dom";
import DogList from "../../dog/DogList";
import { useSelector, useDispatch } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";

const AboutDog = () => {
    const location = useLocation();
    const newDog = location.state?.newDog; // 새로 등록된 강아지 데이터를 가져옴
    const dispatch = useDispatch();
    const userDetail = useSelector(state => state.userEdit.userDetail);
    const dogList = userDetail.dogList;

    useEffect(() => {
        if (newDog && !dogList.some(dog => dog.id === newDog.id)) {
            const updatedUserDetail = {
                ...userDetail,
                dogList: [...dogList, newDog]
            };
            dispatch(userEditActions.updateUserDetail(updatedUserDetail));
        }
    }, [newDog, dispatch, userDetail, dogList]);

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>My Dogs
                <div className={styles.add}>
                    <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                </div>
            </div>
            <div className={styles.container}>
                {dogList && dogList.length > 0 ? (

                        <DogList  />
                ) : (
                    <div className={styles.add}>
                        <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutDog;