import React, { useRef, useState } from 'react';
import styles from './DogWeightInput.module.scss';

const DogWeightInput = ({ dogWeightValue }) => {
    const firstRef = useRef();
    const secondRef = useRef();
    const [weight, setWeight] = useState(0.0);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");

    const handleKeyDown = (e, ref, setter) => {
        if (e.key === 'Enter') {
            calculateWeight();
        }
    };

    const handleChange = (e, ref) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
        ref.current.value = value;

        // 입력된 값이 없으면 isValid를 false로 설정
        if (firstRef.current.value === "" && secondRef.current.value === "") {
            setIsValid(false);
        } else {
            setIsValid(true);
            setError(""); // 에러 메시지 초기화
        }
    };

    const calculateWeight = () => {
        const firstValue = parseFloat(firstRef.current.value) || 0;
        const secondValue = parseFloat(secondRef.current.value) || 0;
        const totalWeight = firstValue + secondValue / 10;
        setWeight(totalWeight);
        if (dogWeightValue) {
            dogWeightValue(totalWeight);
        }
    };

    const nextStep = () => {
        const firstValue = parseFloat(firstRef.current.value) || 0;
        const secondValue = parseFloat(secondRef.current.value) || 0;

        // 입력된 값이 없으면 에러 메시지 설정
        if (firstValue === 0 && secondValue === 0) {
            setError("무게를 입력해주세요.");
            setIsValid(false);
            return;
        }

        const totalWeight = firstValue + secondValue / 10;
        setWeight(totalWeight);
        if (dogWeightValue && firstValue) {
            dogWeightValue(totalWeight);
        }
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 체중</h3>
            <div className={styles.intro}>입력 후 'enter'를 눌러주세요.</div>
            <div className={styles.inputContainer}>
                <input
                    ref={firstRef}
                    onKeyDown={(e) => handleKeyDown(e, firstRef, () => {})}
                    onChange={(e) => handleChange(e, firstRef)}
                    className={styles.input}
                    placeholder={"0"}
                />
                <span className={styles.dot}>.</span>
                <input
                    ref={secondRef}
                    onKeyDown={(e) => handleKeyDown(e, secondRef, () => {})}
                    onChange={(e) => handleChange(e, secondRef)}
                    className={styles.input}
                    placeholder={"0"}
                />
                <span className={styles.unit}>kg</span>
            </div>
            <div className={`${styles.mobileBtn} ${isValid && styles.active}`} onClick={nextStep}>완료</div>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default DogWeightInput;