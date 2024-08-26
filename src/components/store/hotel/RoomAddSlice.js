import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ROOM_URL, UPLOAD_URL, HOTEL_URL} from '../../../config/user/host-config';
import {getUserToken} from "../../../config/user/auth";

const initialRoomAddState = {
    rooms: [],
    name: '',
    content: '',
    type: '',
    price: '',
    roomImages: [{hotelImgUri: '', type: 'ROOM'}],
    errorMessage: '',
    isUploading: false,

};

export const uploadFile = createAsyncThunk(
    'roomAdd/uploadFile',
    async ({file, index}, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
                headers: {
                    "Accept": "application/json",
                    // "Content-Type": "multipart/form-data" 는 자동으로 설정됩니다. 수동으로 설정하지 마세요.
                },
            });

            const responseText = await response.text();
            return {data: responseText, index};
        } catch (e) {
            return thunkAPI.rejectWithValue('Error uploading file: ' + e.message);
        }
    }
);

export const fetchRooms = createAsyncThunk(
    'roomAdd/fetchRooms',
    async (roomId, thunkAPI) => {
        const token = getUserToken();
        const response = await fetch(`${HOTEL_URL}/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        return data.rooms;
    }
);


export const submitRoom = createAsyncThunk(
    'roomAdd/submitRoom',
    async ({roomData, token, hotelId}, thunkAPI) => {
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

export const updateRoom = createAsyncThunk(
    'roomAdd/updateRoom',
    async ({roomData, roomId}, {getState, rejectWithValue}) => {
        const token = getUserToken();
        try {
            const response = await fetch(`${ROOM_URL}/${roomId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'room-name': roomData['room_name'],
                    'room-content': roomData['room-content'],
                    'room-type': roomData['room-type'],
                    'room-price': roomData['room-price'],
                    'room-images': roomData.roomImages.map(image => ({
                        hotelImgUri: typeof image.hotelImgUri === 'string' ? image.hotelImgUri : '',
                        type: image.type || 'ROOM'  // type이 없는 경우 기본값 설정
                    })),
                    'hotel-id': roomData.hotelId // hotelId가 있는지 확인
                })
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }

            const responseData = await response.text();
            try {
                return JSON.parse(responseData);
            } catch (e) {
                return responseData;
            }
        } catch (e) {
            return rejectWithValue('Error updating room: ' + e.message);
        }
    }
);


export const deleteRoom = createAsyncThunk(
    'roomAdd/deleteRoom',
    async (roomId, thunkAPI) => {
        const token = getUserToken();
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
            state.roomImages.push({hotelImgUri: '', type: 'ROOM'});
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
            .addCase(uploadFile.pending, (state) => {
                state.isUploading = true;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                const {data, index} = action.payload;
                if (index !== undefined) {
                    state.roomImages[index].hotelImgUri = data;
                } else {
                    state.roomImages.push({hotelImgUri: data, type: 'ROOM'});
                }
                state.isUploading = false;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.errorMessage = action.payload;
                state.isUploading = false;
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
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const updatedRoom = action.payload;
                const index = state.rooms.findIndex(room => room['room-id'] === updatedRoom['room-id']);
                if (index !== -1) {
                    state.rooms[index] = updatedRoom;
                }
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
                state.loading = false;
                state.step = 4;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const {
    updateRoomData,
    addRoomImage,
    removeRoomImage,
    setErrorMessage,
    resetRoomData,
    setRooms
} = roomAddSlice.actions;
export default roomAddSlice.reducer;