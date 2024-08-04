import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 초기 상태
const initialState = {
    reservation: null,
    status: 'idle',
    error: null,
};

// 예약 생성 Thunk
export const submitReservation = createAsyncThunk(
    'reservation/submitReservation',
    async ({ hotelId, roomId, startDate, endDate, userId, totalPrice }, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
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
                alert("예약이 완료되었습니다.")
            })
            .addCase(submitReservation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default reservationSlice.reducer;
