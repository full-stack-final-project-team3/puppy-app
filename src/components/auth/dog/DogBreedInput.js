import React, { useState } from 'react';
import styles from './DogBreedInput.module.scss';

const breedOptions = [
    { value: 'RETRIEVER', label: '리트리버' },
    { value: 'GOLDEN_RETRIEVER', label: '골든 리트리버' },
    { value: 'LABRADOR_RETRIEVER', label: '래브라도 리트리버' },
    { value: 'SHEPHERD', label: '셰퍼드' },
    { value: 'BULLDOG', label: '불독' },
    { value: 'FRENCH_BULLDOG', label: '프렌치 불독' },
    { value: 'ENGLISH_BULLDOG', label: '잉글리쉬 불독' },
    { value: 'AMERICAN_BULLDOG', label: '아메리칸 불독' },
    { value: 'POODLE', label: '푸들' },
    { value: 'STANDARD_POODLE', label: '스탠다드 푸들' },
    { value: 'BEAGLE', label: '비글' },
    { value: 'YORKSHIRE_TERRIER', label: '요크셔 테리어' },
    { value: 'DACHSHUND', label: '닥스훈트' },
    { value: 'WELSH_CORGI', label: '웰시 코기' },
    { value: 'SIBERIAN_HUSKY', label: '시베리안 허스키' },
    { value: 'DOBERMAN', label: '도베르만' },
    { value: 'SHIH_TZU', label: '시츄' },
    { value: 'BOSTON_TERRIER', label: '보스턴 테리어' },
    { value: 'POMERANIAN', label: '포메라니안' },
    { value: 'CHIHUAHUA', label: '치와와' },
    { value: 'MALTESE', label: '말티즈' },
    { value: 'PIT_BULL', label: '핏불' },
    { value: 'ROTTWEILER', label: '로트와일러' },
    { value: 'SAINT_BERNARD', label: '세인트 버나드' },
    { value: 'SAMOYED', label: '사모예드' },
    { value: 'JINDOTGAE', label: '진돗개' },
    { value: 'COCKER_SPANIEL', label: '코카스파니엘' },
    { value: 'BORDER_COLLIE', label: '보더콜리' },
    { value: 'BICHON_FRISE', label: '비숑 프리제' },
    { value: 'AFGHAN_HOUND', label: '아프간 하운드' },
    { value: 'AKITA', label: '아키타' },
    { value: 'ALASKAN_MALAMUTE', label: '알래스칸 맬러뮤트' },
    { value: 'AUSTRALIAN_SHEPHERD', label: '오스트레일리안 셰퍼드' },
    { value: 'BASSET_HOUND', label: '바셋 하운드' },
    { value: 'BELGIAN_MALINOIS', label: '벨지안 말리노이즈' },
    { value: 'BERNEDOODLE', label: '버니두들' },
    { value: 'BLOODHOUND', label: '블러드하운드' },
    { value: 'BOERBOEL', label: '보어보엘' },
    { value: 'BRIARD', label: '브리어드' },
    { value: 'BRITTANY', label: '브리타니' },
    { value: 'CAIRN_TERRIER', label: '케언 테리어' },
    { value: 'CANE_CORSO', label: '카네 코르소' },
    { value: 'CHOW_CHOW', label: '차우차우' },
    { value: 'DALMATIAN', label: '달마티안' },
    { value: 'DOGO_ARGENTINO', label: '도고 아르헨티노' },
    { value: 'ENGLISH_SETTER', label: '잉글리쉬 세터' },
    { value: 'FINNISH_SPITZ', label: '핀란드 스피츠' },
    { value: 'GERMAN_SHORTHAIRED_POINTER', label: '저먼 쇼트헤어드 포인터' },
    { value: 'GREAT_DANE', label: '그레이트 데인' },
    { value: 'GREYHOUND', label: '그레이하운드' },
    { value: 'HAVANESE', label: '하바네즈' },
    { value: 'IRISH_SETTER', label: '아이리시 세터' },
    { value: 'IRISH_WOLFHOUND', label: '아이리시 울프하운드' },
    { value: 'ITALIAN_GREYHOUND', label: '이탈리안 그레이하운드' },
    { value: 'JACK_RUSSELL_TERRIER', label: '잭 러셀 테리어' },
    { value: 'KEESHOND', label: '키스혼드' },
    { value: 'KERRY_BLUE_TERRIER', label: '케리 블루 테리어' },
    { value: 'KOMONDOR', label: '코몬도르' },
    { value: 'KUVASZ', label: '쿠바스' },
    { value: 'LEONBERGER', label: '레온베르거' },
    { value: 'LHASA_APSO', label: '라사압소' },
    { value: 'MINIATURE_SCHNAUZER', label: '미니어처 슈나우저' },
    { value: 'NEWFOUNDLAND', label: '뉴펀들랜드' },
    { value: 'NORWEGIAN_ELKHOUND', label: '노르웨이 엘크하운드' },
    { value: 'OLD_ENGLISH_SHEEPDOG', label: '올드 잉글리쉬 쉽독' },
    { value: 'PAPILLON', label: '파피용' },
    { value: 'PEKINGESE', label: '페키니즈' },
    { value: 'PHARAOH_HOUND', label: '파라오 하운드' },
    { value: 'PLOTT_HOUND', label: '플롯 하운드' },
    { value: 'PUG', label: '퍼그' },
    { value: 'RHODESIAN_RIDGEBACK', label: '로디지아 리지백' },
    { value: 'SCOTTISH_TERRIER', label: '스코티시 테리어' },
    { value: 'SHIBA_INU', label: '시바 이누' },
    { value: 'SOFT_COATED_WHEATEN_TERRIER', label: '소프트 코티드 휘튼 테리어' },
    { value: 'STAFFORDSHIRE_BULL_TERRIER', label: '스태퍼드셔 불 테리어' },
    { value: 'VIZSLA', label: '비즐라' },
    { value: 'WEIMARANER', label: '바이마라너' },
    { value: 'WHIPPET', label: '휘핏' },
    { value: 'YORKIPOO', label: '요키푸' }
];

const DogBreedInput = ({ dogBreedValue }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBreeds, setFilteredBreeds] = useState(breedOptions);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = breedOptions.filter(breed =>
                breed.label.includes(value)
            );
            setFilteredBreeds(filtered);
        } else {
            setFilteredBreeds(breedOptions);
        }
    };

    const handleBreedSelect = (breed) => {
        setSearchTerm(breed.label);
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
            <ul className={styles.dropdown}>
                {filteredBreeds.length > 0 ? (
                    filteredBreeds.map((breed) => (
                        <li key={breed.value} onClick={() => handleBreedSelect(breed)}>
                            {breed.label}
                        </li>
                    ))
                ) : (
                    <li className={styles.noResults}>해당 견종이 없습니다</li>
                )}
            </ul>
        </div>
    );
};

export default DogBreedInput;