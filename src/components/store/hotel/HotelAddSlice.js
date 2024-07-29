import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { HOTEL_URL, UPLOAD_URL } from '../../../config/user/host-config';

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
        hotelImages: [{ hotelImgUri: '', type: 'HOTEL' }]
    },
    hotelId: null,
    errorMessage: '',
    showConfirmModal: false,
    showRoomModal: false,
};

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

export const submitHotel = createAsyncThunk(
    'hotelAdd/submitHotel',
    async ({ hotelData, token }, thunkAPI) => {
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

const hotelAddSlice = createSlice({
    name: 'hotelAdd',
    initialState: initialHotelAddState,
    reducers: {
        updateHotelData: (state, action) => {
            state.hotelData = { ...state.hotelData, ...action.payload };
        },
        updateImage: (state, action) => {
            const { index, image } = action.payload;
            state.hotelData.hotelImages[index] = image;
        },
        addImage: (state) => {
            state.hotelData.hotelImages.push({ hotelImgUri: '', type: '' });
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
                roomImages: [{ hotelImgUri: '', type: 'ROOM' }],
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.fulfilled, (state, action) => {
                const index = state.hotelData.hotelImages.findIndex(img => !img.hotelImgUri);
                if (index !== -1) {
                    state.hotelData.hotelImages[index] = { hotelImgUri: action.payload, type: 'image' };
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
            });
    }
});

export const {
    updateHotelData, updateImage, addImage, removeImage,
    setShowConfirmModal, setShowRoomModal, setErrorMessage, resetRoomData
} = hotelAddSlice.actions;

export default hotelAddSlice.reducer;
