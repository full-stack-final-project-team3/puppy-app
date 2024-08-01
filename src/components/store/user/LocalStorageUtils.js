
// localStorage에 값을 저장하는 함수
export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error("localStorage에 값을 저장하는 중 에러 발생:", error);
    }
};

// localStorage에서 값을 불러오는 함수
export const loadFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return undefined; // 값이 없을 때 undefined 반환
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error("localStorage에서 값을 불러오는 중 에러 발생:", error);
        return undefined;
    }
};

// localStorage에서 값을 제거하는 함수
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("localStorage에서 값을 제거하는 중 에러 발생:", error);
    }
};