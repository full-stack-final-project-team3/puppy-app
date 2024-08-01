export const saveToLocalStorage = (key, value) => {
    try {
        const saveData = JSON.stringify(value);
        localStorage.setItem(key, saveData);
    } catch (error) {
        console.error("localStorage에 값을 저장하는 중 에러 발생:", error);
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const saveData = localStorage.getItem(key);
        if (saveData === null) {
            return undefined;
        }
        return JSON.parse(saveData);
    } catch (error) {
        console.error("localStorage에서 값을 불러오는 중 에러 발생:", error);
        return undefined;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("localStorage에서 값을 제거하는 중 에러 발생:", error);
    }
};

export const decrementLocalStorageValue = (key) => {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        if (value !== null && !isNaN(value)) {
            localStorage.setItem(key, JSON.stringify(value - 1));
        }
    } catch (error) {
        console.error("localStorage에서 값을 감소시키는 중 에러 발생:", error);
    }
};