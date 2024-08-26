import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HOTEL_URL } from '../../../config/user/host-config';
import {getUserToken} from "../../../config/user/auth";

const initialState = {
    hotels: [],
    step: 1,
    loading: false,
    error: null,
    personCount: 1,
    selectedHotel: null,
    selectedRoom: null,
    totalPrice: 0
};

export const fetchHotels = createAsyncThunk(
    'hotelPage/fetchHotels',
    async (location, thunkAPI) => {
        const token = getUserToken();
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
        const token = getUserToken();
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
            state.selectedHotel = null;
            state.selectedRoom = null;
        },
        setSelectedRoom: (state, action) => {
            state.selectedRoom = action.payload;
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        setHotels: (state, action) => {
            state.hotels = action.payload;
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

export const {
    setStep,
    incrementPersonCount,
    decrementPersonCount,
    resetHotels,
    setSelectedRoom,
    setTotalPrice,
    setHotels
} = hotelPageSlice.actions;

export default hotelPageSlice.reducer;
