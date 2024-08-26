import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {HOTEL_URL, UPLOAD_URL} from '../../../config/user/host-config';
import {getUserToken} from "../../../config/user/auth";

const initialHotelAddState = {
    hotelData: {
        name: '',
        description: '',
        businessOwner: '',
        location: '',
        rulesPolicy: '',
        cancelPolicy: '',
        price: '',
        phoneNumber: '',
        hotelImages: [{hotelImgUri: '', type: 'HOTEL'}]
    },
    hotels: [],
    hotelId: null,
    errorMessage: '',
    showConfirmModal: false,
    showRoomModal: false,
};

// 파일 업로드 비동기
export const uploadFile = createAsyncThunk(
    'hotelAdd/uploadFile',
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.text();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue('Error uploading file');
        }
    }
);

// 호텔 조회 비동기처리
export const fetchHotelDetails = createAsyncThunk(
    'hotel/fetchDetails',
    async (hotelId, thunkAPI) => {
        try {
            const response = await fetch(`${HOTEL_URL}/${hotelId}`);
            if (!response.ok) {
                const error = await response.json();
                return thunkAPI.rejectWithValue(error.message);
            }
            return await response.json();
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to fetch hotel details');
        }
    }
);

// 호텔 추가 비동기
export const submitHotel = createAsyncThunk(
    'hotelAdd/submitHotel',
    async ({hotelData, token}, thunkAPI) => {
        try {
            const response = await fetch(`${HOTEL_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'hotel-name': hotelData.name,
                    'description': hotelData.description,
                    'business-owner': hotelData.businessOwner,
                    'location': hotelData.location,
                    'rules-policy': hotelData.rulesPolicy,
                    'cancel-policy': hotelData.cancelPolicy,
                    'price': hotelData.price,
                    'phone-number': hotelData.phoneNumber,
                    'hotel-images': hotelData.hotelImages.map(image => ({
                        hotelImgUri: image.hotelImgUri,
                        type: 'HOTEL'
                    }))
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.id;
            } else {
                const errorData = await response.json();
                return thunkAPI.rejectWithValue(errorData.error || 'Failed to add hotel');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('An error occurred while adding the hotel');
        }
    }
);

// 호텔 삭제 비동기
export const deleteHotel = createAsyncThunk(
    'hotelPage/deleteHotel',
    async (hotelId, { getState, rejectWithValue }) => {
        const token = getUserToken();
        try {
            const response = await fetch(`${HOTEL_URL}/${hotelId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to delete the hotel');
            }
            return hotelId; // 삭제된 호텔 ID 반환
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 호텔 수정 비동기
export const updateHotel = createAsyncThunk(
    'hotelAdd/updateHotel',
    async ({ hotelId, hotelData }, { rejectWithValue }) => {
        const token = getUserToken();
        try {
            const response = await fetch(`${HOTEL_URL}/${hotelId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    'hotel-name': hotelData.name,
                    'description': hotelData.description,
                    'business-owner': hotelData.businessOwner,
                    'location': hotelData.location,
                    'rules-policy': hotelData.rulesPolicy,
                    'cancel-policy': hotelData.cancelPolicy,
                    'price': hotelData.price,
                    'phone-number': hotelData.phoneNumber,
                    'hotel-images': hotelData.hotelImages.map(image => ({
                        hotelImgUri: image.hotelImgUri,
                        type: 'HOTEL'
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.text(); // 오류 응답을 텍스트로 받음
                throw new Error(errorData || 'Failed to update the hotel');
            }

            return await response.text();
        } catch (error) {
            console.error("호텔 업데이트 오류:", error.message);
            return rejectWithValue(error.message);
        }
    }
);



const hotelAddSlice = createSlice({
    name: 'hotelAdd',
    initialState: initialHotelAddState,
    reducers: {
        updateHotelData: (state, action) => {
            state.hotelData = {...state.hotelData, ...action.payload};
        },
        updateImage: (state, action) => {
            const {index, image} = action.payload;
            state.hotelData.hotelImages[index] = image;
        },
        addImage: (state) => {
            state.hotelData.hotelImages.push({hotelImgUri: '', type: ''});
        },
        removeImage: (state, action) => {
            state.hotelData.hotelImages = state.hotelData.hotelImages.filter((_, i) => i !== action.payload);
        },
        setShowConfirmModal: (state, action) => {
            state.showConfirmModal = action.payload;
        },
        setShowRoomModal: (state, action) => {
            state.showRoomModal = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        resetRoomData: (state) => {
            // 룸 데이터를 초기화하는 로직을 추가.
            state.roomData = {
                name: '',
                content: '',
                type: '',
                price: '',
                roomImages: [{hotelImgUri: '', type: 'ROOM'}],
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.fulfilled, (state, action) => {
                const index = state.hotelData.hotelImages.findIndex(img => !img.hotelImgUri);
                if (index !== -1) {
                    state.hotelData.hotelImages[index] = {hotelImgUri: action.payload, type: 'image'};
                }
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(submitHotel.fulfilled, (state, action) => {
                state.hotelId = action.payload;
                state.showConfirmModal = true;
            })
            .addCase(submitHotel.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(deleteHotel.fulfilled, (state, action) => {
                if (state.hotels) {
                    state.hotels = state.hotels.filter(hotel => hotel.id !== action.payload);
                    alert("호텔이 삭제되었습니다.")
                }
            })
            .addCase(deleteHotel.rejected, (state, action) => {
                // 에러 처리
                state.errorMessage = action.payload;
            })
            .addCase(updateHotel.fulfilled, (state, action) => {
                const index = state.hotels.findIndex(hotel => hotel.id === action.payload.id);
                if (index !== -1) {
                    state.hotels[index] = {...state.hotels[index], ...action.payload};
                }
            })
            .addCase(updateHotel.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(fetchHotelDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHotelDetails.fulfilled, (state, action) => {
                state.details = action.payload;
                state.loading = false;
            })
            .addCase(fetchHotelDetails.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
});

export const {
    updateHotelData, updateImage, addImage, removeImage,
    setShowConfirmModal, setShowRoomModal, setErrorMessage, resetRoomData
} = hotelAddSlice.actions;

export default hotelAddSlice.reducer;
