import React, {useEffect} from 'react';
import styles from './AboutDog.module.scss';
import {Link} from "react-router-dom";
import DogList from "../../dog/DogList";
import {useSelector} from "react-redux";

const AboutDog = () => {

    // 유저의 상태가 바뀌면 redux에서 다시 업데이트 해줘야 한다.

    const userDetail = useSelector(state => state.userEdit.userDetail);
    const dogList = userDetail.dogList;

    console.log(dogList)


    return (
        <div className={styles.wrap}>
            <div className={styles.me}>My Dogs
                <div className={styles.add}>
                    <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                </div>
            </div>

            <div className={styles.container}>
                {dogList.map(dog => (
                    <DogList key={dog.id} dog={dog} />
                ))}
            </div>
        </div>
    );
};

export default AboutDog;