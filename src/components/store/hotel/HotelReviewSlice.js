import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    reviews: [],
    reviewContent: '',
    rate: 0,
    loading: false,
    error: null,
};


// 리뷰 목록 조회
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (hotelId, thunkAPI) => {
        try {
            const response = await fetch(`http://localhost:8888/api/reviews?hotelId=${hotelId}`);
            if (!response.ok) {
                const errorText = await response.json();
                throw new Error(`Failed to fetch reviews: ${errorText}`);
            }
            const data = await response.json();
            return {hotelId, reviews: data}; // 리뷰 데이터와 호텔 ID를 함께 반환
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

// 리뷰 추가
export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({hotelId, reviewContent, rate, userId}, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        const reviewData = {hotelId, reviewContent, rate, userId};
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
                return thunkAPI.rejectWithValue(`Failed to add review: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// 리뷰 삭제
export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async ({ reviewId, userId }, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        try {
            const response = await fetch(`http://localhost:8888/api/reviews/${reviewId}?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                return thunkAPI.rejectWithValue(`Failed to delete review: ${errorText}`);
            }

            return reviewId;
        } catch (e) {
            return thunkAPI.rejectWithValue('Network error or server is unreachable.');
        }
    }
);


// 리뷰 수정 비동기
export const modifyReview = createAsyncThunk(
    'reviews/modifyReview',
    async ({ reviewId, reviewContent, rate, userId }, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        try {
            const response = await fetch(`http://localhost:8888/api/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewContent, rate, userId })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to update the review');
            }
            return await response.json();
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
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
                // 기존 리뷰에 새로운 리뷰 데이터를 추가
                state.reviews = [
                    ...state.reviews.filter(review => review.hotelId !== action.payload.hotelId),
                    ...action.payload.reviews
                ];
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(rev => rev.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                console.error("Error in deleting review:", action.payload);
            })
            .addCase(modifyReview.fulfilled, (state, action) => {
                const updatedReview = action.payload;
                const existingReview = state.reviews.find(rev => rev.id === updatedReview.id);
                if (existingReview) {
                    existingReview.reviewContent = updatedReview.reviewContent;
                    existingReview.rate = updatedReview.rate;
                }
            })
            .addCase(modifyReview.rejected, (state, action) => {
                console.error("Error in modifying review:", action.payload);
            });
    },
});

export const {setReviewContent, setRate} = reviewSlice.actions;
export default reviewSlice.reducer;
