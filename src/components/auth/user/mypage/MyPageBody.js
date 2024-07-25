import React, {useEffect, useState} from 'react';
import AboutMe from "./AboutMe";
import AboutDog from "./AboutDog";
import {DOG_URL} from "../../../../config/user/host-config";
import {Link} from "react-router-dom";
import styles from "./MyPageBody.module.scss"

const MyPageBody = ({ user }) => {

    const { id } = user;
    // console.log(id)

    const [dogList, setDogList] = useState("");

    useEffect(() => {

        const fetchData = async () => {
            try {
                // console.log(id)
                const response = await fetch(`${DOG_URL}/user/${id}`);
                const userDetailData = await response.json();
                setDogList(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    console.log(dogList)


    return (
        <div>
            <AboutMe user={user} />

            {user && user.dogList && user.dogList.length > 0 ? (
                <AboutDog dogList={dogList} />
            ) : (
                <div className={styles.add}>
                    <Link className={styles.addDog}>강아지 등록하기</Link>
                </div>
            )}
        </div>
    );
};

export default MyPageBody;