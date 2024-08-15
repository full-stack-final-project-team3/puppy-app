import React, {useEffect, useState} from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import {useRouteLoaderData} from "react-router-dom";
import {DOG_URL} from "../../../../config/user/host-config";
import DogEdit from "../../dog/DogEdit";
import {useSelector} from "react-redux";
import UserEdit from "./UserEdit";
import AboutMyInfo from "./AboutMyInfo.js";
import AdminPage from "../../../../pages/user/AdminPage"
import Footer from "../../../../layout/user/Footer";
import spinnerStyles from "../../../../layout/user/Spinner.module.scss";
import {PulseLoader} from "react-spinners";

const MyPageMain = () => {

    const authCheck = useRouteLoaderData('auth-check-loader');

    const [loading, setLoading] = useState(true);

    const [clickAdmin, setClickAdmin] = useState(false)

    const userDetail = useSelector(state => state.userEdit.userDetail);

    const [dogList, setDogList] = useState([]);

    const isEditMode = useSelector(state => state.userEdit.isEditMode);
    const isDogEditMode = useSelector(state => state.dogEdit.isDogEditMode);
    const isUserEditMode = useSelector(state => state.userEdit.isUserEditMode);

    const {id} = userDetail;

    useEffect(() => {
        if (!id) return;

        const fetchDogData = async () => {
            try {
                const response = await fetch(`${DOG_URL}/user/${id}`);
                const dogData = await response.json();
                setDogList(dogData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        };
        const timer = setTimeout(() => {
            fetchDogData();
        }, 850)
    }, [id]);

    const startAdminMode = () => {
        setClickAdmin(true)
    }

    const exit = (flag) => {
        setClickAdmin(flag)
    }

    if (loading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={spinnerStyles.spinnerContainer}>
                    <PulseLoader
                        className={spinnerStyles.loader}
                        color="#0B593F"
                        loading={loading}
                        size={18}
                    />{" "}
                </div>
            </div>
        );
    }


    return (
        userDetail.role === "USER" ? (
            <>
                <div className={styles.wrap}>
                    <MyPageHeader/>
                    {!isEditMode && <MyPageBody user={userDetail} dogList={dogList}/>}
                    {isUserEditMode && <UserEdit/>}
                    {isDogEditMode && <DogEdit user={userDetail}/>}
                    {!isEditMode && <AboutMyInfo/>}
                </div>
                <Footer/>
            </>
        ) : (
            clickAdmin ?
                <AdminPage exit={exit}/>
                :
                (<>
                    <div className={styles.wrap}>
                        <p onClick={startAdminMode} className={styles.admin}>Admin Page 가기</p>
                        <MyPageHeader/>
                        {!isEditMode && <MyPageBody user={userDetail} dogList={dogList}/>}
                        {isUserEditMode && <UserEdit/>}
                        {isDogEditMode && <DogEdit user={userDetail}/>}
                        {!isEditMode && <AboutMyInfo/>}
                    </div>
                    <Footer/>
                </>)


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