import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialReservationState = {
    selectedCity: '',
    startDate: null,
    endDate: null,
    personCount: 1,
    showWarning: false,
};

const ReservationSlice = createSlice({
    name: 'reservation',
    initialState: initialReservationState,
    reducers: {
        setSelectedCity(state, action) {
            state.selectedCity = action.payload;
        },
        setStartDate(state, action) {
            state.startDate = action.payload; // 문자열로 저장
        },
        setEndDate(state, action) {
            state.endDate = action.payload; // 문자열로 저장
        },
        setPersonCount(state, action) { // personCount를 설정하는 액션 추가
            state.personCount = action.payload;
        },
        setShowWarning(state, action) {
            state.showWarning = action.payload;
        },
    },
});

export const {
    setSelectedCity,
    setStartDate,
    setEndDate,
    setShowWarning,
    setPersonCount
} = ReservationSlice.actions;

export default ReservationSlice.reducer;
