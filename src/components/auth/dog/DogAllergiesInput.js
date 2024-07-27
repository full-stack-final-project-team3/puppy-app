import React, { useState, useEffect } from 'react';
import styles from './DogAllergiesInput.module.scss';

const allergiesOptions = [
    { value: 'BEEF', label: '소고기' },
    { value: 'CHICKEN', label: '닭고기' },
    { value: 'CORN', label: '옥수수' },
    { value: 'DAIRY', label: '유제품' },
    { value: 'FISH', label: '생선' },
    { value: 'LAMB', label: '양고기' },
    { value: 'PORK', label: '돼지고기' },
    { value: 'TURKEY', label: '칠면조' },
    { value: 'WHEAT', label: '밀' },
];

const DogAllergiesInput = ({ onAllergiesChange }) => {
    const [selectedAllergy, setSelectedAllergy] = useState([]);
    const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        const newAllergies = selectedAllergy.includes(value)
            ? selectedAllergy.filter((allergy) => allergy !== value)
            : [...selectedAllergy, value];
        setSelectedAllergy(newAllergies);
    };

    const handleSkip = () => {
        setSelectedAllergy([]);
        onAllergiesChange([]);
    };

    const handleSubmit = () => {
        onAllergiesChange(selectedAllergy);
    };

    useEffect(() => {
        setIsNextButtonEnabled(selectedAllergy.length > 0);
    }, [selectedAllergy]);

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지의 알러지를 체크해주세요!</h3>
            <div className={styles.allergies}>
                {allergiesOptions.map((option) => (
                    <label key={option.value} className={styles.label}>
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedAllergy.includes(option.value)}
                            onChange={handleCheckboxChange}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
            <button className={styles.skip} onClick={handleSkip}>Skip</button>
            <button
                className={styles.submit}
                onClick={handleSubmit}
                disabled={!isNextButtonEnabled}
            >
                작성 완료
            </button>
            <div>알러지 더 추가 예정 - 기범</div>
        </div>
    );
};

export default DogAllergiesInput;