import React, { useEffect, useState } from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import { useRouteLoaderData } from "react-router-dom";
import { AUTH_URL, DOG_URL } from "../../../../config/user/host-config";
import DogEdit from "../../dog/DogEdit";
import {useDispatch, useSelector} from "react-redux";
import UserEdit from "./UserEdit";


const MyPageMain = () => {
    const userData = useRouteLoaderData('user-data2');
    const [userDetail, setUserDetail] = useState({});
    const [dogList, setDogList] = useState([]);

    // userdata, userdata2 가 undefined

    const isEditMode = useSelector(state => state.userEdit.isEditMode)
    const isDogEditMode = useSelector(state => state.dogEdit.isDogEditMode)
    const isUserEditMode = useSelector(state => state.userEdit.isUserEditMode)



    useEffect(() => {

        if (!userData) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`${AUTH_URL}/${userData.email}`);
                const userDetailData = await response.json();
                setUserDetail(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const { id } = userDetail;

    useEffect(() => {
        if (!id) return; // id가 없는 경우 요청을 보내지 않음

        const fetchData = async () => {
            try {
                const response = await fetch(`${DOG_URL}/user/${id}`);
                const userDetailData = await response.json();
                setDogList(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);


    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            {
                !isEditMode &&
                <MyPageBody user={userDetail} dogList={dogList} />
            }
            { isUserEditMode && <UserEdit user={userDetail}/>}
            { isDogEditMode && <DogEdit /> }
        </div>
    );
};

export default MyPageMain;