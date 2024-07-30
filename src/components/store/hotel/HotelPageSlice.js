
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOTEL_URL } from '../../../config/user/host-config';

export const fetchHotels = createAsyncThunk(
    'hotelPage/fetchHotels',
    async (location, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        const response = await fetch(`${HOTEL_URL}?location=${location}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        const data = await response.json();
        return data.hotels;
    }
);

export const fetchHotelDetails = createAsyncThunk(
    'hotelPage/fetchHotelDetails',
    async (hotelId, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        const response = await fetch(`${HOTEL_URL}/${hotelId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch hotel details');
        }
        const data = await response.json();
        return data;
    }
);

const initialState = {
    hotels: [],
    step: 1,
    loading: false,
    error: null,
    personCount: 1,
    selectedHotel: null, // 추가된 초기화
};

const hotelPageSlice = createSlice({
    name: 'hotelPage',
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        incrementPersonCount: (state) => {
            state.personCount += 1;
        },
        decrementPersonCount: (state) => {
            state.personCount = Math.max(1, state.personCount - 1);
        },
        resetHotels: (state) => {
            state.hotels = [];
            state.selectedHotel = null; // 추가된 초기화
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.hotels = action.payload;
                state.loading = false;
                state.step = 2;
            })
            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // fetchHotelDetails 액션 처리 추가
            .addCase(fetchHotelDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotelDetails.fulfilled, (state, action) => {
                state.selectedHotel = action.payload;
                state.loading = false;
            })
            .addCase(fetchHotelDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setStep, incrementPersonCount, decrementPersonCount, resetHotels } = hotelPageSlice.actions;

export default hotelPageSlice.reducer;

