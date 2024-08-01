import { createSlice } from '@reduxjs/toolkit';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from './LocalStorageUtils';

const initialState = {
    userInfo: {},
    existNotice: loadFromLocalStorage('existNotice') || false,
    noticeCount: loadFromLocalStorage('noticeCount') || 0,
    noticeMessage: loadFromLocalStorage('noticeMessage') || '',
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
            state.existNotice = false;
            state.noticeCount = 0;
            removeFromLocalStorage('existNotice');
            removeFromLocalStorage('noticeCount');
        },
        setNoticeMessage: (state, action) => {
            state.noticeMessage = action.payload;
            saveToLocalStorage('noticeMessage', state.noticeMessage);
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;