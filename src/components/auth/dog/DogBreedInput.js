import React, { useState } from 'react';
import styles from './DogBreedInput.module.scss';

const DogBreedInput = ({ dogBreedValue }) => {


    const [selectedBreed, setSelectedBreed] = useState('');

    const breedOptions = [
        { value: 'RETRIEVER', label: '리트리버' },
        { value: 'JINDO', label: '진돗개' },
        { value: 'POMERANIAN', label: '포메라니안' },
        { value: 'CHIHUAHUA', label: '치와와' },
        { value: 'MALTESE', label: '말티즈' },
        { value: 'BULLDOG', label: '불독' },
        { value: 'POODLE', label: '푸들' },
        { value: 'BEAGLE', label: '비글' },
        { value: 'WELSH_CORGI', label: '웰시 코기' },
        { value: 'SIBERIAN_HUSKY', label: '시베리안 허스키' },
        { value: 'BOSTON_TERRIER', label: '보스턴 테리어' },
        { value: 'YORKSHIRE_TERRIER', label: '요크셔 테리어' },
        { value: 'DACHSHUND', label: '닥스훈트' },
        { value: 'DOBERMAN', label: '도베르만' },
        { value: 'SHIH_TZU', label: '시츄' },
        { value: 'SHEPHERD', label: '셰퍼드' },
        { value: 'PIT_BULL', label: '핏불' },
        { value: 'ROTTWEILER', label: '로트와일러' },
        { value: 'SAINT_BERNARD', label: '세인트 버나드' },
        { value: 'SAMOYED', label: '사모예드' },
    ];

    const handleBreedChange = (event) => {
        const breed = event.target.value;
        setSelectedBreed(breed);
        dogBreedValue(breed);
        console.log(breed)
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 견종을 선택해주세요!</h3>
            <select className={styles.select} value={selectedBreed} onChange={handleBreedChange}>
                <option value="">선택하세요</option>
                {breedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DogBreedInput;