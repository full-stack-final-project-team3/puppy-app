

export const decideGender = (gender) => {
    switch (gender) {
        case "FEMALE":
            return "암컷";
        case "MALE":
            return "수컷";
        case "NEUTER":
            return "비밀";
        default:
            return "";
    }
}

export const decideSize = (size) => {
    switch (size) {
        case "SMALL":
            return "소형견";
        case "MEDIUM":
            return "중형견";
        case "LARGE":
            return "대형견";
        default:
            return "";
    }
}


export const allergyTranslations = {
    BEEF: '소고기',
    CHICKEN: '닭고기',
    CORN: '옥수수',
    DAIRY: '유제품',
    FISH: '생선',
    FLAX: '아마씨',
    LAMB: '양고기',
    PORK: '돼지고기',
    TURKEY: '칠면조',
    WHEAT: '밀',
    SOY: '콩',
    RICE: '쌀',
    PEANUT: '땅콩',
    BARLEY: '보리',
    OAT: '귀리',
    POTATO: '감자',
    TOMATO: '토마토',
};

export const translateAllergy = (allergy) => {
    return allergyTranslations[allergy] || allergy;
};


export const breedTranslations = {
    RETRIEVER: '리트리버',
    진돗개: '진돗개',
    CHIHUAHUA: '치와와',
    POMERANIAN: '포메라니안',
    MALTESE: '말티즈',
    POODLE: '푸들',
    WELSH_CORGI: '웰시 코기',
    SIBERIAN_HUSKY: '시베리안 허스키',
    BEAGLE: '비글',
    YORKSHIRE_TERRIER: '요크셔 테리어',
    DACHSHUND: '닥스훈트',
    DOBERMAN: '도베르만',
    SHIH_TZU: '시츄',
    BOSTON_TERRIER: '보스턴 테리어',
    PIT_BULL: '핏불',
    BULLDOG: '불독',
    ROTTWEILER: '로트와일러',
    SHEPHERD: '셰퍼드',
    SAINT_BERNARD: '세인트 버나드',
    SAMOYED: '사모예드',
};

export const translateBreed = (breed) => {
    return breedTranslations[breed] || breed;
};