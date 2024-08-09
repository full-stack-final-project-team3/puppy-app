import React, { useEffect, useState } from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import { useRouteLoaderData } from "react-router-dom";
import { DOG_URL } from "../../../../config/user/host-config";
import DogEdit from "../../dog/DogEdit";
import { useSelector } from "react-redux";
import UserEdit from "./UserEdit";
import AboutMyInfo from "./AboutMyInfo.js";
import AdminPage from "../../../../pages/user/AdminPage"

const MyPageMain = () => {

    const authCheck = useRouteLoaderData('auth-check-loader');

    const [clickAdmin, setClickAdmin] = useState(false)

    const userDetail = useSelector(state => state.userEdit.userDetail);

    const [dogList, setDogList] = useState([]);

    const isEditMode = useSelector(state => state.userEdit.isEditMode);
    const isDogEditMode = useSelector(state => state.dogEdit.isDogEditMode);
    const isUserEditMode = useSelector(state => state.userEdit.isUserEditMode);

    const { id } = userDetail;

    useEffect(() => {
        if (!id) return;

        const fetchDogData = async () => {
            try {
                const response = await fetch(`${DOG_URL}/user/${id}`);
                const dogData = await response.json();
                setDogList(dogData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDogData();
    }, [id]);

    const startAdminMode = () => {
        setClickAdmin(true)
    }

    const exit = () => {
        setClickAdmin(true)
        console.log(clickAdmin)
    }


    return (
        userDetail.role === "USER" ? (
            <div className={styles.wrap}>
                <MyPageHeader />
                {!isEditMode && <MyPageBody user={userDetail} dogList={dogList} />}
                {isUserEditMode && <UserEdit />}
                {isDogEditMode && <DogEdit user={userDetail} />}
                {!isEditMode && <AboutMyInfo />}
            </div>
        ) : (
            clickAdmin ? (<div className={styles.wrap}>
                <p onClick={startAdminMode}>Admin Page 가기</p>
                <MyPageHeader/>
                {!isEditMode && <MyPageBody user={userDetail} dogList={dogList}/>}
                {isUserEditMode && <UserEdit/>}
                {isDogEditMode && <DogEdit user={userDetail}/>}
                {!isEditMode && <AboutMyInfo/>}
            </div>) :
                <AdminPage exit={exit}/>


            // <>
            //     <AdminPage/>
            //     <div className={styles.wrap}>
            //         <MyPageHeader/>
            //         {!isEditMode && <MyPageBody user={userDetail} dogList={dogList}/>}
            //         {isUserEditMode && <UserEdit/>}
            //         {isDogEditMode && <DogEdit user={userDetail}/>}
            //         {!isEditMode && <AboutMyInfo/>}
            //     </div>
            // </>
        )
    );
};

export default MyPageMain;