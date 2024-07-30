import React, { useState } from 'react';
import styles from './DogSexInput.module.scss'

const DogSexInput = ({ dogSexValue }) => {

    const [gender, setGender] = useState('')

    const sexOptions = [
        {value: 'MALE', label: '수컷'},
        {value: 'FEMALE', label: "암컷"},
        {value: 'NEUTER', label: '비밀'},
    ]

    const sexChange = (e) => {
        const sex = e.target.value;
        setGender(sex);
        dogSexValue(sex);
    }

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 성별!</h3>
            <select className={styles.select} onChange={sexChange}>
                <option value="">선택하세요</option>
                {sexOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DogSexInput;