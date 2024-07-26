import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
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


//createAsyncThunk 리액트에서 비동기를 더 쉽개 해주기 위한 리덕스 도구
export const uploadFile = createAsyncThunk(
    // 비동기 작업의 이름을 설정해줌 이걸로 리덕스가 액션을 기억할 수 있음!!!
    // 비동기 작업이 수행됐을 때 액션 타입은 아래 3가지
    // pending: 비동기 작업이 시작될 때 디스패치.
    // fulfilled: 비동기 작업이 성공적으로 완료되었을 때 디스패치.
    // rejected: 비동기 작업이 실패했을 때 디스패치.
    // 이걸 사용해서 아래 createSlice 에서 extraReducers 사용할 수 있네여!
    'hotelAdd/uploadFile',

    // 여기서 첫번째 파라미터는 서버에서 전달받을 데이터의 이름 지금은 이미지 파일 업로드라 파일이라 지었으나 아무거나 바꿔도 문제없을듯?

    // thunkAPI 는 리덕스에서 제공하는 비동기 파라미터 기본적인 기능으로 아래 5가지를 제공해주네요

    // dispatch: 다른 액션을 디스패치할 수 있습니다.
    // getState: 현재 상태를 가져올 수 있습니다.
    // extra: thunk 를 생성할 때 전달된 추가 인자를 가져옵니다.
    // signal: 비동기 작업을 취소할 때 사용하는 AbortController 의 signal 객체입니다.
    // rejectWithValue: 비동기 작업이 실패했을 때 특정 값을 반환하여 에러 상태를 관리할 수 있습니다.

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
        }
    },
    // builder 사용하는 이유는 위에 액션의 3가지 상태인 대기 성공 실패를 사용할때 좋기 때문에 ㅇㅇ
    extraReducers: (builder) => {
        builder
            // 업로드에 성공하면 이미지 정보 업데이트
            .addCase(uploadFile.fulfilled, (state, action) => {
                const index = state.hotelData.hotelImages.findIndex(img => !img.hotelImgUri);
                if (index !== -1) {
                    state.hotelData.hotelImages[index] = { hotelImgUri: action.payload, type: 'image' };
                }
            })
            //업로드가 실패하면 에러메세지
            .addCase(uploadFile.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            // 호텔 정보 제출이 성공하면 호텔 ID를 저장하고 모달창 띄우기
            .addCase(submitHotel.fulfilled, (state, action) => {
                state.hotelId = action.payload;
                state.showConfirmModal = true;
            })
            // 호텔 제출 실패하면 에러메세지 띄우기
            .addCase(submitHotel.rejected, (state, action) => {
                state.errorMessage = action.payload;
            });
    }
});


export const {
    updateHotelData, updateImage, addImage, removeImage,
    setShowConfirmModal, setShowRoomModal, setErrorMessage
} = hotelAddSlice.actions;

export default hotelAddSlice.reducer;