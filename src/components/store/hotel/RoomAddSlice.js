import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ROOM_URL, UPLOAD_URL } from '../../../config/user/host-config';

const initialRoomAddState = {
    name: '',
    content: '',
    type: '',
    price: '',
    roomImages: [{ hotelImgUri: '', type: 'ROOM' }],
    errorMessage: ''
};

export const uploadFile = createAsyncThunk(
    'roomAdd/uploadFile',
    async ({ file, index }, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.text();
            return { data, index };
        } catch (e) {
            return thunkAPI.rejectWithValue('Error uploading file');
        }
    }
);

export const submitRoom = createAsyncThunk(
    'roomAdd/submitRoom',
    async ({ roomData, token, hotelId }, thunkAPI) => {
        try {
            const response = await fetch(`${ROOM_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'room-name': roomData.name,
                    'room-content': roomData.content,
                    'room-type': roomData.type,
                    'room-price': roomData.price,
                    'room-images': roomData.roomImages.map(image => ({
                        hotelImgUri: image.hotelImgUri,
                        type: 'ROOM'
                    })),
                    'hotel-id': hotelId // hotelId 포함
                })
            });

            if (response.ok) {
                // JSON 형식이 아닐 경우 텍스트로 처리
                const responseData = await response.text();
                try {
                    // JSON 형식인지 확인
                    return JSON.parse(responseData);
                } catch {
                    // JSON 형식이 아닌 경우 텍스트 그대로 반환
                    return responseData;
                }
            } else {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                return thunkAPI.rejectWithValue(errorData.message || '방 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            return thunkAPI.rejectWithValue('방 추가 중 오류가 발생했습니다.');
        }
    }
);

const roomAddSlice = createSlice({
    name: 'roomAdd',
    initialState: initialRoomAddState,
    reducers: {
        updateRoomData: (state, action) => {
            Object.keys(action.payload).forEach(key => {
                state[key] = action.payload[key];
            });
        },
        addRoomImage: (state) => {
            state.roomImages.push({ hotelImgUri: '', type: 'ROOM' });
        },
        removeRoomImage: (state, action) => {
            state.roomImages = state.roomImages.filter((_, i) => i !== action.payload);
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        resetRoomData: () => initialRoomAddState // 초기 상태로 리셋
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.fulfilled, (state, action) => {
                const { data, index } = action.payload;
                state.roomImages[index] = { hotelImgUri: data, type: 'ROOM' };
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(submitRoom.fulfilled, (state, action) => {
                state.roomId = action.payload;
            })
            .addCase(submitRoom.rejected, (state, action) => {
                state.errorMessage = action.payload;
            });
    }
});


export const { updateRoomData, addRoomImage, removeRoomImage, setErrorMessage, resetRoomData } = roomAddSlice.actions;
export default roomAddSlice.reducer;
