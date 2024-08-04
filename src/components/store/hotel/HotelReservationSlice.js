import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userEditActions } from '../user/UserEditSlice';
import { NOTICE_URL } from "../../../config/user/host-config";

// 초기 상태
const initialState = {
    reservation: null,
    status: 'idle',
    error: null,
};

// 예약 생성 Thunk
export const submitReservation = createAsyncThunk(
    'reservation/submitReservation',
    async ({ hotelId, roomId, startDate, endDate, userId, totalPrice, user, email, token, createdAt }, { rejectWithValue, dispatch }) => {
        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            const response = await fetch('http://localhost:8888/api/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelId,
                    roomId,
                    reservationAt: startDate,
                    reservationEndAt: endDate,
                    userId,
                    price: totalPrice,
                    cancelled: 'SUCCESS'
                }),
            });

            if (!response.ok) {
                throw new Error('Reservation failed');
            }

            const data = await response.json();

            // 예약 성공 시 알림을 추가합니다.
            const newNotice = {
                id: new Date().getTime(),
                message: `호텔에 예약이 완료되었습니다.`,
                isClicked: false,
                userId: userId, // userId 추가
                createdAt
            };

            // 서버로 알림을 보내는 예시
            const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNotice),
            });

            if (noticeResponse.ok) {
                dispatch(userEditActions.addUserNotice(newNotice));
                const updatedUserDetailWithNoticeCount = {
                    ...user,
                    noticeCount: (user.noticeCount || 0) + 1 // user.noticeCount 가 undefined 일 경우 대비
                };
                dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));
            } else {
                alert('예약은 성공했으나 알림 추가에 실패했습니다.');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitReservation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(submitReservation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reservation = action.payload;
            })
            .addCase(submitReservation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default reservationSlice.reducer;
