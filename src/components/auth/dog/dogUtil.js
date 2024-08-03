

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
    DUCK: '오리',
    SALMON: '연어'
};

export const translateAllergy = (allergy) => {
    return allergyTranslations[allergy] || allergy;
};

export const breedTranslations = {
    RETRIEVER: '리트리버',
    GOLDEN_RETRIEVER: '골든 리트리버',
    LABRADOR_RETRIEVER: '래브라도 리트리버',
    SHEPHERD: '셰퍼드',
    BULLDOG: '불독',
    FRENCH_BULLDOG: '프렌치 불독',
    ENGLISH_BULLDOG: '잉글리쉬 불독',
    AMERICAN_BULLDOG: '아메리칸 불독',
    POODLE: '푸들',
    STANDARD_POODLE: '스탠다드 푸들',
    BEAGLE: '비글',
    YORKSHIRE_TERRIER: '요크셔 테리어',
    DACHSHUND: '닥스훈트',
    WELSH_CORGI: '웰시 코기',
    SIBERIAN_HUSKY: '시베리안 허스키',
    DOBERMAN: '도베르만',
    SHIH_TZU: '시츄',
    BOSTON_TERRIER: '보스턴 테리어',
    POMERANIAN: '포메라니안',
    CHIHUAHUA: '치와와',
    MALTESE: '말티즈',
    PIT_BULL: '핏불',
    ROTTWEILER: '로트와일러',
    SAINT_BERNARD: '세인트 버나드',
    SAMOYED: '사모예드',
    JINDOTGAE: '진돗개',
    COCKER_SPANIEL: '코카스파니엘',
    BORDER_COLLIE: '보더콜리',
    BICHON_FRISE: '비숑 프리제',
    AFGHAN_HOUND: '아프간 하운드',
    AKITA: '아키타',
    ALASKAN_MALAMUTE: '알래스칸 맬러뮤트',
    AUSTRALIAN_SHEPHERD: '오스트레일리안 셰퍼드',
    BASSET_HOUND: '바셋 하운드',
    BELGIAN_MALINOIS: '벨지안 말리노이즈',
    BERNEDOODLE: '버니두들',
    BLOODHOUND: '블러드하운드',
    BOERBOEL: '보어보엘',
    BRIARD: '브리어드',
    BRITTANY: '브리타니',
    CAIRN_TERRIER: '케언 테리어',
    CANE_CORSO: '카네 코르소',
    CHOW_CHOW: '차우차우',
    DALMATIAN: '달마티안',
    DOGO_ARGENTINO: '도고 아르헨티노',
    ENGLISH_SETTER: '잉글리쉬 세터',
    FINNISH_SPITZ: '핀란드 스피츠',
    GERMAN_SHORTHAIRED_POINTER: '저먼 쇼트헤어드 포인터',
    GREAT_DANE: '그레이트 데인',
    GREYHOUND: '그레이하운드',
    HAVANESE: '하바네즈',
    IRISH_SETTER: '아이리시 세터',
    IRISH_WOLFHOUND: '아이리시 울프하운드',
    ITALIAN_GREYHOUND: '이탈리안 그레이하운드',
    JACK_RUSSELL_TERRIER: '잭 러셀 테리어',
    KEESHOND: '키스혼드',
    KERRY_BLUE_TERRIER: '케리 블루 테리어',
    KOMONDOR: '코몬도르',
    KUVASZ: '쿠바스',
    LEONBERGER: '레온베르거',
    LHASA_APSO: '라사압소',
    MINIATURE_SCHNAUZER: '미니어처 슈나우저',
    NEWFOUNDLAND: '뉴펀들랜드',
    NORWEGIAN_ELKHOUND: '노르웨이 엘크하운드',
    OLD_ENGLISH_SHEEPDOG: '올드 잉글리쉬 쉽독',
    PAPILLON: '파피용',
    PEKINGESE: '페키니즈',
    PHARAOH_HOUND: '파라오 하운드',
    PLOTT_HOUND: '플롯 하운드',
    PUG: '퍼그',
    RHODESIAN_RIDGEBACK: '로디지아 리지백',
    SCOTTISH_TERRIER: '스코티시 테리어',
    SHIBA_INU: '시바 이누',
    SOFT_COATED_WHEATEN_TERRIER: '소프트 코티드 휘튼 테리어',
    STAFFORDSHIRE_BULL_TERRIER: '스태퍼드셔 불 테리어',
    VIZSLA: '비즐라',
    WEIMARANER: '바이마라너',
    WHIPPET: '휘핏',
    YORKIPOO: '요키푸'
};
export const translateBreed = (breed) => {
    return breedTranslations[breed] || breed;
};