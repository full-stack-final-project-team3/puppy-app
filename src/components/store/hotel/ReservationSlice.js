import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROOM_URL } from '../../../config/user/host-config';

export const fetchAvailableRooms = createAsyncThunk(
    'reservation/fetchAvailableRooms',
    async ({ city, startDate, endDate }, thunkAPI) => {
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();

        const response = await fetch(`${ROOM_URL}/available?hotelId=${city}&reservationAt=${encodeURIComponent(formattedStartDate)}&reservationEndAt=${encodeURIComponent(formattedEndDate)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch available rooms');
        }
        const data = await response.json();
        return data;
    }
);

const initialReservationState = {
    selectedCity: '',
    startDate: null,
    endDate: null,
    personCount: 1,
    showWarning: false,
    availableRooms: [],
};

const ReservationSlice = createSlice({
    name: 'reservation',
    initialState: initialReservationState,
    reducers: {
        setSelectedCity(state, action) {
            state.selectedCity = action.payload;
        },
        setStartDate(state, action) {
            state.startDate = action.payload;
        },
        setEndDate(state, action) {
            state.endDate = action.payload;
        },
        setPersonCount(state, action) {
            state.personCount = action.payload;
        },
        setShowWarning(state, action) {
            state.showWarning = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
                state.availableRooms = action.payload;
            })
            .addCase(fetchAvailableRooms.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export const {
    setSelectedCity,
    setStartDate,
    setEndDate,
    setShowWarning,
    setPersonCount
} = ReservationSlice.actions;

export default ReservationSlice.reducer;
