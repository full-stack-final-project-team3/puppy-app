import React, { useState } from 'react';
import DogNameInput from "./DogNameInput";
import DogBirthdayInput from "./DogBirthdayInput";
import DogBreedInput from "./DogBreedInput";
import styles from "./AddDogMain.module.scss";
import DogSexInput from "./DogSexInput";
import DogWeightInput from "./DogWeightInput";
import DogAllergiesInput from "./DogAllergiesInput";
import { useNavigate } from "react-router-dom";
import { DOG_URL, NOTICE_URL } from "../../../config/user/host-config";
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../store/user/UserEditSlice";

const AddDogMain = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.userEdit.userDetail);
    const dispatch = useDispatch();
    const email = user.email;

    // 갔다온 적이 있나? 로 막아버리기
    const [visitedSteps, setVisitedSteps] = useState([1]);


    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [dogSize, setDogSize] = useState('');
    const [allergies, setAllergies] = useState([]);
    const profileUrl = "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fst2.depositphotos.com%2F5045705%2F11671%2Fv%2F950%2Fdepositphotos_116714982-stock-illustration-little-puppy-icon.jpg&type=a340";


    const dogNameValue = (dogName) => {
        setName(dogName);
        setStep(2);
        setVisitedSteps([1,2])
    };

    const dogBreedValue = (dogBreed) => {
        setBreed(dogBreed);
        setStep(3);
        setVisitedSteps([1,2,3])
    };

    const dogBirthdayValue = (date) => {
        const formatDate = date.format('YYYY-MM-DD');
        setBirthday(formatDate);
        setStep(4);
        setVisitedSteps([1,2,3,4])
    };

    const dogSexValue = (sex) => {
        setGender(sex);
        setStep(5);
        setVisitedSteps([1,2,3,4,5])
    }

    const dogWeightValue = (weight) => {
        setWeight(weight);
        if (weight > 25) {
            setDogSize("LARGE");
        } else if (weight > 10) {
            setDogSize("MEDIUM");
        } else {
            setDogSize("SMALL");
        }
        setStep(6);
    }

    const dogAllergiesValue = async (allergies) => {
        setAllergies(allergies);

        const payload = {
            dogName: name,
            dogBreed: breed,
            birthday: birthday,
            dogSex: gender,
            dogSize: dogSize,
            weight: weight,
            allergies: allergies,
            dogProfileUrl: profileUrl,
        };

        try {
            const response = await fetch(`${DOG_URL}/register/${email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const newDog = await response.json();

            if (response.ok) {
                const updatedUserDetail = {
                    ...user,
                    dogList: [...user.dogList, newDog]
                };

                dispatch(userEditActions.updateUserDetail(updatedUserDetail));

                const noticePayload = {
                    userId: user.id,
                    message: `${name}가(이) 등록되었습니다!`
                };

                try {
                    const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(noticePayload)
                    });

                    const noticeResponseText = await noticeResponse.text();

                    console.log(noticeResponseText);

                    let newNotice;
                    try {
                        newNotice = JSON.parse(noticeResponseText);
                    } catch (jsonError) {
                        alert('강아지 등록은 성공했으나 알림 추가에 실패했습니다.');
                        return;
                    }

                    if (noticeResponse.ok) {
                        dispatch(userEditActions.addUserNotice(newNotice));
                        const updatedUserDetailWithNoticeCount = {
                            ...user,
                            noticeCount: user.noticeCount + 1
                        };
                        dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));
                        alert('강아지 등록 성공!');
                    } else {
                        alert('강아지 등록은 성공했으나 알림 추가에 실패했습니다.');
                    }

                } catch (error) {
                    alert('강아지 등록은 성공했으나 알림 추가 중 오류가 발생했습니다.');
                }

                // navigate 호출을 상태 업데이트 후에 실행
                navigate('/mypage', { state: { newDog }, replace: true });
            } else {
                alert('강아지 등록 실패!');
            }
        } catch (error) {
            alert('강아지 등록 중 오류가 발생했습니다.');
        }
    }

    const switchStep = (num) => {
        if (visitedSteps.length >= num) setStep(num)
    }

    return (
        <>
            <div className={styles.stepWrap}>
                <div className={styles.subWrap}>
                    <div className={`${styles.step} ${step >= 1 ? styles.finishStep : ''}`} onClick={() => switchStep(1)}>1</div>
                    <div className={`${styles.stepLine} ${step >= 2 ? styles.finishStep : ''}`}></div>
                    <div className={`${styles.step} ${step >= 2 ? styles.finishStep : ''}`} onClick={() => switchStep(2)}>2</div>
                    <div className={`${styles.stepLine} ${step >= 3 ? styles.finishStep : ''}`}></div>
                    <div className={`${styles.step} ${step >= 3 ? styles.finishStep : ''}`} onClick={() => switchStep(3)}>3</div>
                    <div className={`${styles.stepLine} ${step >= 4 ? styles.finishStep : ''}`}></div>
                    <div className={`${styles.step} ${step >= 4 ? styles.finishStep : ''}`} onClick={() => switchStep(4)}>4</div>
                    <div className={`${styles.stepLine} ${step >= 5 ? styles.finishStep : ''}`}></div>
                    <div className={`${styles.step} ${step >= 5 ? styles.finishStep : ''}`} onClick={() => switchStep(5)}>5</div>
                    <div className={`${styles.stepLine} ${step >= 6 ? styles.finishStep : ''}`}></div>
                    <div className={`${styles.step} ${step >= 6 ? styles.finishStep : ''}`} onClick={() => switchStep(6)}>6</div>
                </div>
            </div>
            <div className={styles.wrap}>
                {step === 1 && <DogNameInput dogNameValue={dogNameValue}/>}
                {step === 2 && <DogBreedInput dogBreedValue={dogBreedValue}/>}
                {step === 3 && <DogBirthdayInput onDateChange={dogBirthdayValue}/>}
                {step === 4 && <DogSexInput dogSexValue={dogSexValue}/>}
                {step === 5 && <DogWeightInput dogWeightValue={dogWeightValue}/>}
                {step === 6 && <DogAllergiesInput onAllergiesChange={dogAllergiesValue}/>}
            </div>
        </>
    );
};

export default AddDogMain;