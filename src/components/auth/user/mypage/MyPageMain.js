import React, { useEffect, useState } from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import {useRouteLoaderData} from "react-router-dom";
import { AUTH_URL, DOG_URL } from "../../../../config/user/host-config";
import DogEdit from "../../dog/DogEdit";
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import UserEdit from "./UserEdit";


const MyPageMain = () => {

    const userData = useRouteLoaderData('user-data2');


    const userDetail = useSelector(state => state.userEdit.userDetail);
    const [dogList, setDogList] = useState([]);

    const isEditMode = useSelector(state => state.userEdit.isEditMode);
    const isDogEditMode = useSelector(state => state.dogEdit.isDogEditMode);
    const isUserEditMode = useSelector(state => state.userEdit.isUserEditMode);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!userData) return;
    //
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`${AUTH_URL}/${userData.email}`);
    //             const userDetailData = await response.json();
    //             dispatch(userEditActions.updateUserDetail(userDetailData));
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchData();
    // }, [userData, dispatch]);

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

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            {
                !isEditMode &&
                <MyPageBody user={userDetail} dogList={dogList} />
            }
            {isUserEditMode && <UserEdit user={userDetail} />}
            {isDogEditMode && <DogEdit user={userDetail}/>}
        </div>
    );
};

export default MyPageMain;