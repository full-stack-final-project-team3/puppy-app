


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

// localStorage에서 숫자를 감소시키는 함수
export const decrementLocalStorageValue = (key) => {
    try {
        const value = loadFromLocalStorage(key);
        if (typeof value === 'number' && value > 0) {
            const newValue = value - 1;
            saveToLocalStorage(key, newValue);
            return newValue;
        } else {
            console.warn(`${key} 값이 숫자가 아니거나 0 이하입니다.`);
            return value;
        }
    } catch (error) {
        console.error(`${key} 값을 감소시키는 중 에러 발생:`, error);
        return undefined;
    }
};