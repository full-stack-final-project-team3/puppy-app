import React, {useRef, useState} from 'react';
import styles from './DogNameInput.module.scss';

const DogNameInput = ({dogNameValue}) => {
    const nameRef = useRef();
    const [dogName, setDogName] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false)

    const releaseActive = () => {
        const currentDogName = nameRef.current.value.trim();
        const koreanRegex = /^[가-힣]+$/;

        // 입력값 검증
        if (koreanRegex.test(currentDogName)) {
            setIsValid(true)
        } else if (!koreanRegex.test(currentDogName) || currentDogName.length === 0)  {
            setIsValid(false)
        }
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const currentDogName = nameRef.current.value.trim();

            // 한글만 허용하는 정규식
            const koreanRegex = /^[가-힣]+$/;

            // 입력값 검증
            if (!koreanRegex.test(currentDogName)) {
                setError("한글만 입력 가능합니다.");
                return;
            } else if (currentDogName.length < 2 || currentDogName.length > 10) {
                setError("2글자 이상, 10글자 이하로 입력해주세요.");
                return;
            }
            setError("");
            setDogName(currentDogName);
            dogNameValue(currentDogName);
        }
    };

    const nextStep = () => {
        const currentDogName = nameRef.current.value.trim();
        setError("");
        setDogName(currentDogName);
        dogNameValue(currentDogName);
    }

    return (

        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지의 이름을 입력해주세요!</h3>
            <div className={styles.intro}>입력 후 'enter'를 눌러주세요.</div>
            <input
                ref={nameRef}
                className={styles.input}
                placeholder={"강아지 이름"}
                onKeyDown={handleKeyDown}
                onChange={releaseActive}
            />
            {error && <div className={styles.error}>{error}</div>}
            <div className={`${styles.mobileBtn} ${isValid && styles.active}`} onClick={nextStep}>완료</div>
        </div>

    );
};

export default DogNameInput;