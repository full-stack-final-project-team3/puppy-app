import { createSlice } from '@reduxjs/toolkit';
import {
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,
    decrementLocalStorageValue
} from './LocalStorageUtils';

const initialState = {
    userInfo: {},
    existNotice: loadFromLocalStorage('existNotice') || false,
    noticeCount: loadFromLocalStorage('noticeCount') || 0,
    noticeMessage: loadFromLocalStorage('noticeMessage') || [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            saveToLocalStorage('userInfo', state.userInfo);
        },
        setExistNotice: (state) => { // 유저가 일련의 행위를 하면 호출
            state.existNotice = true;
            state.noticeCount += 1;
            saveToLocalStorage('existNotice', state.existNotice);
            saveToLocalStorage('noticeCount', state.noticeCount);
        },
        clearExistNotice: (state) => { // 알림 삭제
            state.noticeCount = decrementLocalStorageValue('noticeCount');
            if (state.noticeCount === 0) {
                state.existNotice = false;
                removeFromLocalStorage('existNotice');
                removeFromLocalStorage('noticeCount');
            }
        },
        setNoticeMessage: (state, action) => {
            if (Array.isArray(state.noticeMessage)) {
                state.noticeMessage = [...state.noticeMessage, action.payload];
            } else {
                state.noticeMessage = [action.payload];
            }
            saveToLocalStorage('noticeMessage', state.noticeMessage);
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;