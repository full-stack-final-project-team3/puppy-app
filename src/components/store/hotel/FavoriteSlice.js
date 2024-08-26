import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {HOTEL_URL} from "../../../config/user/host-config";
import {getUserToken} from "../../../config/user/auth";

const initialState = {
    favorites: [],
    status: null
}


// 즐겨찾기 목록 불러오기
export const fetchFavorites = createAsyncThunk(
    'favorites/fetch',
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getUserToken();
            const response = await fetch(`${HOTEL_URL}/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Server response wasn\'t OK');
            return response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// 비동기 즐겨찾기 추가 액션
export const addFavorite = createAsyncThunk(
    'favorites/add',
    async (hotelId, {getState, rejectWithValue}) => {
        const token = getUserToken();
        const userId = getState().userEdit.userDetail.userId;
        const response = await fetch(`${HOTEL_URL}/${hotelId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({userId})
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        return {hotelId, userId};
    }
);


// 비동기 즐겨찾기 제거 액션
export const removeFavorite = createAsyncThunk(
    'favorites/remove',
    async (hotelId, {getState, rejectWithValue}) => {
        const token = getUserToken();
        const userId = getState().userEdit.userDetail.userId;
        const response = await fetch(`${HOTEL_URL}/${hotelId}/favorite`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({userId})
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        return {hotelId, userId};
    }
);


const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favorites.push(action.payload); // 응답 구조 확인 필요
                state.status = 'success';
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter(fav => fav.hotelId !== action.payload.hotelId);
                state.status = 'success';
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "즐겨찾기 추가에 실패했습니다.";
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || "즐겨찾기 제거에 실패했습니다.";
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favorites = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            });
    }
});

export default favoriteSlice.reducer;
