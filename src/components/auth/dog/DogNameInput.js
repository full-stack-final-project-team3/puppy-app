import React, { useRef, useState } from 'react';
import styles from './DogNameInput.module.scss';

const DogNameInput = ({ dogNameValue }) => {
    const nameRef = useRef();
    const [dogName, setDogName] = useState("");

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const currentDogName = nameRef.current.value;
            setDogName(currentDogName);
            dogNameValue(currentDogName); // dogName 대신 currentDogName 사용
            console.log("Dog Name:", currentDogName); // 입력값을 콘솔에 출력
        }
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지의 이름을 입력해주세요!</h3>
            <div className={styles.intro}>입력 후 'enter'를 눌러주세요.</div>
            <input
                ref={nameRef}
                className={styles.input}
                placeholder={"강아지 이름"}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default DogNameInput;