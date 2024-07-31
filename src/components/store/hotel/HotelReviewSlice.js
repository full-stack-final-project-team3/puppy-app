import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    reviews: [],
    reviewContent: '',
    rate: 0,
    loading: false,
    error: null,
};

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (hotelId, thunkAPI) => {
        try {
            const response = await fetch(`http://localhost:8888/api/reviews?hotelId=${hotelId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch reviews: ${errorText}`);
            }
            const data = await response.json();
            console.log("잘가져옴? ",hotelId)
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({ hotelId, reviewContent, rate, userId }, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        const reviewData = { hotelId, reviewContent, rate, userId };
        console.log('Sending review data to server:', reviewData); // 데이터 확인
        try {
            const response = await fetch('http://localhost:8888/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add review: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        setReviewContent: (state, action) => {
            state.reviewContent = action.payload;
        },
        setRate: (state, action) => {
            state.rate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
                state.reviewContent = ''; // Clear the review content
                state.rate = 0; // Reset the rate
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setReviewContent, setRate } = reviewSlice.actions;
export default reviewSlice.reducer;
