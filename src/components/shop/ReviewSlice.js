import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SHOP_URL } from '../../../config/user/host-config'; // UPLOAD_URL import

// 파일 업로드 비동기 함수
export const uploadFile = createAsyncThunk(
    'userEdit/uploadFile',
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${SHOP_URL}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.text();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('에러 업로드 파일');
        }
    }
);

const userEditSlice = createSlice({
    name: 'userEdit',
    initialState: {
        userDetail: {},
        uploadStatus: 'idle',
        uploadError: null,
    },
    reducers: {
        updateUserDetail(state, action) {
            state.userDetail = action.payload;
        },
        addUserNotice(state, action) {
            // Add notice logic
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.uploadStatus = 'loading';
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                // 업로드된 파일의 URL을 상태에 저장할 수 있습니다.
                state.uploadedFileUrl = action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.uploadError = action.payload;
            });
    },
});

export const { updateUserDetail, addUserNotice } = userEditSlice.actions;

export default userEditSlice.reducer;
