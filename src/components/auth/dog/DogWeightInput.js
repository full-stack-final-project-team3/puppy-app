import React, { useRef, useState } from 'react';
import styles from './DogWeightInput.module.scss';

const DogWeightInput = ({ dogWeightValue }) => {
    const firstRef = useRef();
    const secondRef = useRef();
    const [weight, setWeight] = useState(0.0);


    const handleKeyDown = (e, ref, setter) => {
        if (e.key === 'Enter') {
            const value = parseFloat(ref.current.value);
            setter(value);
            calculateWeight();
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

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 체중</h3>
            <div className={styles.intro}>입력 후 'enter'를 눌러주세요.</div>
            <div className={styles.div}>
                <input
                    ref={firstRef}
                    onKeyDown={(e) => handleKeyDown(e, firstRef, () => {})}
                    className={styles.input}
                    placeholder={"0"}
                />
                <span className={styles.span}>.</span>
                <input
                    ref={secondRef}
                    onKeyDown={(e) => handleKeyDown(e, secondRef, () => {})}
                    className={styles.input}
                    placeholder={"0"}
                />kg
            </div>
        </div>
    );
};

export default DogWeightInput;