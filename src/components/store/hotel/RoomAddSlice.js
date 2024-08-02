import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ROOM_URL, UPLOAD_URL } from '../../../config/user/host-config';

const initialRoomAddState = {
    rooms: [],
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
                    'hotel-id': hotelId
                })
            });

            if (response.ok) {
                const responseData = await response.text();
                try {
                    return JSON.parse(responseData);
                } catch {
                    return responseData;
                }
            } else {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.message || '방 추가에 실패했습니다.');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('방 추가 중 오류가 발생했습니다.');
        }
    }
);

export const deleteRoom = createAsyncThunk(
    'roomAdd/deleteRoom',
    async (roomId, thunkAPI) => {
        const token = JSON.parse(localStorage.getItem('userData')).token;
        try {
            const response = await fetch(`${ROOM_URL}/${roomId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.text();
                return thunkAPI.rejectWithValue(errorData);
            }
            return roomId;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
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
        resetRoomData: () => initialRoomAddState,
        setRooms: (state, action) => {
            state.rooms = action.payload;
        },
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
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(room => room['room-id'] !== action.payload);
                alert("객실이 삭제되었습니다.")
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.errorMessage = action.payload;
            });
    }
});

export const { updateRoomData, addRoomImage, removeRoomImage, setErrorMessage, resetRoomData, setRooms } = roomAddSlice.actions;
export default roomAddSlice.reducer;
