import { createSlice } from '@reduxjs/toolkit';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage, decrementLocalStorageValue } from './LocalStorageUtils';

const initialState = {
    userInfo: {},
    existNotice: loadFromLocalStorage('existNotice') || false,
    noticeCount: loadFromLocalStorage('noticeCount') || 0,
    noticeMessage: loadFromLocalStorage('noticeMessage') || [],
    clickedMessages: loadFromLocalStorage('clickedMessages') || {},
};

const makeNowTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);
    const fullTime = year + '-' + month  + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return fullTime;
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            saveToLocalStorage('userInfo', state.userInfo);
        },
        setExistNotice: (state) => {
            state.existNotice = true;
            state.noticeCount += 1;
            saveToLocalStorage('existNotice', state.existNotice);
            saveToLocalStorage('noticeCount', state.noticeCount);
        },
        clearExistNotice: (state, action) => {
            const index = action.payload;
            state.clickedMessages[index] = true;
            if (state.noticeCount > 0) {
                state.noticeCount -= 1;
                decrementLocalStorageValue('noticeCount');
            }
            saveToLocalStorage('clickedMessages', state.clickedMessages);
            if (state.noticeCount === 0) {
                state.existNotice = false;
                removeFromLocalStorage('existNotice');
                removeFromLocalStorage('noticeCount');
            }
        },
        setNoticeMessage: (state, action) => {
            const messageWithTime = { message: action.payload, time: makeNowTime() };
            state.noticeMessage = [...state.noticeMessage, messageWithTime];
            saveToLocalStorage('noticeMessage', state.noticeMessage);
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

// 지금 안되는것
// 안누른게 회색이 되어있음.
// 엄한곳 눌러도 숫자 줄어듬
