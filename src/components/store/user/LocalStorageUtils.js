//
//
// // localStorage에 값을 저장하는 함수
// export const saveToLocalStorage = (key, value) => {
//     try {
//         const serializedValue = JSON.stringify(value);
//         localStorage.setItem(key, serializedValue);
//     } catch (error) {
//         console.error("localStorage에 값을 저장하는 중 에러 발생:", error);
//     }
// };
//
// // localStorage에서 값을 불러오는 함수
// export const loadFromLocalStorage = (key) => {
//     try {
//         const serializedValue = localStorage.getItem(key);
//         if (serializedValue === null) {
//             return undefined; // 값이 없을 때 undefined 반환
//         }
//         return JSON.parse(serializedValue);
//     } catch (error) {
//         console.error("localStorage에서 값을 불러오는 중 에러 발생:", error);
//         return undefined;
//     }
// };
//
// // localStorage에서 값을 제거하는 함수
// export const removeFromLocalStorage = (key) => {
//     try {
//         localStorage.removeItem(key);
//     } catch (error) {
//         console.error("localStorage에서 값을 제거하는 중 에러 발생:", error);
//     }
// };
//
// // localStorage에서 값을 1씩 감소시키는 함수
// export const decrementLocalStorageValue = (key) => {
//     try {
//         let value = loadFromLocalStorage(key);
//         if (value !== undefined && value > 0) {
//             value -= 1;
//             saveToLocalStorage(key, value);
//             return value;
//         }
//         return 0;
//     } catch (error) {
//         console.error("localStorage에서 값을 감소시키는 중 에러 발생:", error);
//         return 0;
//     }
// };
//
// // localStorage에서 모든 값을 제거하는 함수
// export const clearLocalStorage = () => {
//     try {
//         localStorage.clear();
//     } catch (error) {
//         console.error("localStorage에서 모든 값을 제거하는 중 에러 발생:", error);
//     }
// };