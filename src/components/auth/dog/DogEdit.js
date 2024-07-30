import React, {useEffect} from 'react';
import styles from './DogEdit.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";
import {dogEditActions} from "../../store/dog/DogEditSlice";
import {DOG_URL} from "../../../config/user/host-config";
import {useNavigate} from "react-router-dom";
import {decideGender, decideSize, translateAllergy, translateBreed} from './dogUtil'

const DogEdit = () => {
    const dog = useSelector(state => state.dogEdit.dogInfo);
    const userDetail = useSelector(state => state.userEdit.userDetail);
    const navi = useNavigate();

    const dispatch = useDispatch();
    const clearEditMode = e => {
        dispatch(userEditActions.clearMode())
        dispatch(dogEditActions.clearEdit())
    }


    const removeHandler = async () => {
        try {
            const response = await fetch(`${DOG_URL}/${dog.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                alert("삭제 되었습니다.");
                const updatedDogList = userDetail.dogList.filter(d => d.id !== dog.id);
                dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
                dispatch(userEditActions.clearMode())
                dispatch(dogEditActions.clearEdit())
                navi("/mypage");
            } else {
                alert("삭제에 실패했습니다.");
                console.error('삭제 실패:', response.statusText);
            }
        } catch (error) {
            console.error('에러 발생:', error);
            alert("삭제 중 에러가 발생했습니다.");
        }
    }

    return (
        <div>
            <div className={styles.wrap}>
                <img className={styles.img} src="/header-logo.png" alt="Header Logo"/>
                <div className={styles.flex}>
                    <div className={styles.left}>
                        <h2 className={styles.title}>{dog.dogName}의 정보</h2>
                        <div className={styles.row}>
                            <div className={styles.item}>견종</div>
                            <span className={styles.answer}>{translateBreed(dog.dogBreed)}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>생일</div>
                            <span className={styles.answer}>{dog.birthday} <span
                                className={styles.sub}>{dog.age}세</span></span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>성별</div>
                            <span className={styles.answer}>{decideGender(dog.dogSex)}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>체중</div>
                            <input className={styles.input} value={dog.weight} type="number"/> <span
                            className={styles.sub}>{decideSize(dog.dogSize)}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>보유 알러지</div>
                            <div className={styles.answer}>
                                {Array.isArray(dog.allergies) ? dog.allergies.map((allergy, index) => (
                                    <span key={index} className={styles.badge}>{translateAllergy(allergy)}</span>
                                )) : dog.allergies}
                            </div>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <img className={styles.dogProfileUrl} src={dog.dogProfileUrl} alt="Dog Profile"/>
                    </div>
                </div>
                <button onClick={removeHandler}>삭제</button>
                <button onClick={clearEditMode}>완료</button>
            </div>
        </div>
    );
};

export default DogEdit;