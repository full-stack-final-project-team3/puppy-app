import React, { useState } from 'react';
import styles from './DogBreedInput.module.scss';

const DogBreedInput = ({ dogBreedValue }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBreeds, setFilteredBreeds] = useState([]);

    const breedOptions = [
        { value: 'RETRIEVER', label: '리트리버' },
        { value: 'JINDOTGAE', label: '진돗개' },
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

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = breedOptions.filter(breed =>
                breed.label.includes(value)
            );
            setFilteredBreeds(filtered);
        } else {
            setFilteredBreeds([]);
        }
    };

    const handleBreedSelect = (breed) => {
        setSearchTerm(breed.label);
        setFilteredBreeds([]);
        dogBreedValue(breed.value);
    };

    return (
        <div className={styles.wrap}>
            <h3 className={styles.h3}>강아지 견종을 선택해주세요!</h3>
            <input
                type="text"
                className={styles.input}
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="견종을 검색하세요"
            />
            {filteredBreeds.length > 0 && (
                <ul className={styles.dropdown}>
                    {filteredBreeds.map((breed) => (
                        <li key={breed.value} onClick={() => handleBreedSelect(breed)}>
                            {breed.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DogBreedInput;