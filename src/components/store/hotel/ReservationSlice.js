import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {userEditActions} from '../user/UserEditSlice';
import {ROOM_URL, NOTICE_URL, RESERVATION_URL, HOTEL_URL, FRONT} from "../../../config/user/host-config";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { v4 as uuidv4 } from 'uuid';
import {getUserToken} from "../../../config/user/auth";

// Dayjs 플러그인 등록
dayjs.extend(utc);
dayjs.extend(timezone);

const initialState = {
    reservation: null,
    status: 'idle',
    error: null,
    availableRooms: [],
    selectedCity: '',
    startDate: null,
    endDate: null,
    personCount: 1,
    showWarning: false,
    userReservations: [],
    totalPrice: 0,
};

export const fetchAvailableRooms = createAsyncThunk(
    'reservation/fetchAvailableRooms',
    async ({city, startDate, endDate}, thunkAPI) => {
        // 시간대를 KST로 설정하여 처리
        const formattedStartDate = dayjs(startDate).tz('Asia/Seoul').hour(14).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss');
        const formattedEndDate = dayjs(endDate).tz('Asia/Seoul').hour(11).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss');

        const response = await fetch(`${ROOM_URL}/available?hotelId=${city}&reservationAt=${encodeURIComponent(formattedStartDate)}&reservationEndAt=${encodeURIComponent(formattedEndDate)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch available rooms');
        }
        const data = await response.json();
        return data;
    }
);

export const fetchReservation = createAsyncThunk(
    'reservation/fetchReservation',
    async ({reservationId}, {rejectWithValue}) => {
        try {
            const token = getUserToken();
            const response = await fetch(`${RESERVATION_URL}/${reservationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reservation');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserReservations = createAsyncThunk(
    'reservation/fetchUserReservations',
    async ({userId}, {rejectWithValue, dispatch}) => {
        try {
            const token = getUserToken();
            const response = await fetch(`${RESERVATION_URL}/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user reservations');
            }

            const reservations = await response.json();

            const detailedReservations = await Promise.all(reservations.map(async (reservation) => {
                const [hotelResponse, roomResponse] = await Promise.all([
                    fetch(`${HOTEL_URL}/${reservation.hotelId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`${ROOM_URL}/${reservation.roomId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                ]);

                if (hotelResponse.ok && roomResponse.ok) {
                    const hotel = await hotelResponse.json();
                    const room = await roomResponse.json();
                    return {...reservation, hotel, room};
                } else {
                    throw new Error('Failed to fetch hotel or room details');
                }
            }));

            return detailedReservations;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 카카오 결제
export const submitReservationWithKakaoPay = createAsyncThunk(
    'reservation/submitReservationWithKakaoPay',
    async ({
               hotelId,
               roomId,
               startDate,
               endDate,
               userId,
               totalPrice,
               user,
               email,
               token,
               createdAt,
               hotelName
           }, {rejectWithValue, dispatch}) => {
        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            // Step 1: 카카오페이 결제 준비
            const orderId = uuidv4();
            const approvalUrl = `${FRONT}/hotel/`;
            const cancelUrl = `${FRONT}/hotel/`;
            const failUrl = `${FRONT}/hotel/`;

            const paymentResponse = await fetch('https://kapi.kakao.com/v1/payment/ready', {
                method: 'POST',
                headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                body: new URLSearchParams({
                    cid: 'TC0ONETIME',
                    partner_order_id: orderId,
                    partner_user_id: userId,
                    item_name: 'Hotel Booking',
                    quantity: 1,
                    total_amount: totalPrice,
                    vat_amount: 0,
                    tax_free_amount: 0,
                    approval_url: approvalUrl,
                    cancel_url: cancelUrl,
                    fail_url: failUrl,
                })
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();  // 에러 메시지를 JSON으로 파싱
                console.error('카카오페이 결제 준비 실패:', errorData);
                throw new Error(errorData.msg || '결제 준비 중 오류가 발생했습니다.');
            }

            const paymentData = await paymentResponse.json();

            // Step 2: 결제 URL로 리다이렉트
            window.location.href = paymentData.next_redirect_pc_url;

            // Step 3: 결제 성공 후 예약 저장 로직 (결제가 성공된 후 서버에서 처리)
            const reservationAt = dayjs(startDate).tz('Asia/Seoul').format();
            const reservationEndAt = dayjs(endDate).tz('Asia/Seoul').format();

            const reservationResponse = await fetch(`${RESERVATION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelId,
                    roomId,
                    reservationAt,
                    reservationEndAt,
                    userId,
                    price: totalPrice,
                    cancelled: 'SUCCESS'
                }),
            });

            if (!reservationResponse.ok) {
                throw new Error('Reservation failed');
            }

            const reservationData = await reservationResponse.json();

            // 알림 추가 로직
            const newNotice = {
                id: new Date().getTime(),
                message: `${hotelName}에 예약이 완료되었습니다.`,
                isClicked: false,
                userId,
                createdAt
            };

            const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNotice),
            });

            if (noticeResponse.ok) {
                dispatch(userEditActions.addUserNotice(newNotice));
                const updatedUserDetailWithNoticeCount = {
                    ...user,
                    noticeCount: (user.noticeCount || 0) + 1
                };
                dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));
            } else {
                alert('예약은 성공했으나 알림 추가에 실패했습니다.');
            }

            return reservationData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const submitReservation = createAsyncThunk(
    'reservation/submitReservation',
    async ({
               hotelId,
               roomId,
               startDate,
               endDate,
               userId,
               totalPrice,
               user,
               email,
               token,
               createdAt,
               hotelName
           }, {rejectWithValue, dispatch}) => {
        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            const reservationAt = dayjs(startDate).tz('Asia/Seoul').format();
            const reservationEndAt = dayjs(endDate).tz('Asia/Seoul').format();

            const response = await fetch(`${RESERVATION_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelId,
                    roomId,
                    reservationAt,
                    reservationEndAt,
                    userId,
                    price: totalPrice,
                    cancelled: 'SUCCESS'
                }),
            });

            if (!response.ok) {
                throw new Error('Reservation failed');
            }

            const data = await response.json();

            const newNotice = {
                id: new Date().getTime(),
                message: `${hotelName}에 예약이 완료되었습니다.`,
                isClicked: false,
                userId,
                createdAt
            };

            const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNotice),
            });

            if (noticeResponse.ok) {
                dispatch(userEditActions.addUserNotice(newNotice));
                const updatedUserDetailWithNoticeCount = {
                    ...user,
                    noticeCount: (user.noticeCount || 0) + 1
                };
                dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));
            } else {
                alert('예약은 성공했으나 알림 추가에 실패했습니다.');
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteReservation = createAsyncThunk(
    'reservation/deleteReservation',
    async (reservationId, {getState, rejectWithValue}) => {
        const token = getUserToken();
        try {
            const response = await fetch(`${RESERVATION_URL}/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message);
            }
            return reservationId;
        } catch (e) {
            return rejectWithValue('Network error or server is unreachable.');
        }
    }
);

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setSelectedCity(state, action) {
            state.selectedCity = action.payload;
        },
        setStartDate(state, action) {
            state.startDate = action.payload;
        },
        setEndDate(state, action) {
            state.endDate = action.payload;
        },
        setPersonCount(state, action) {
            state.personCount = action.payload;
        },
        setShowWarning(state, action) {
            state.showWarning = action.payload;
        },
        setTotalPrice(state, action) {
            state.totalPrice = action.payload;
        },
        resetReservation(state) {
            state.selectedCity = '';
            state.startDate = null;
            state.endDate = null;
            state.personCount = 1;
            state.showWarning = false;
            state.totalPrice = 0;
            state.availableRooms = [];
            state.reservation = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
                state.availableRooms = action.payload;
            })
            .addCase(fetchAvailableRooms.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(submitReservation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(submitReservation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reservation = action.payload;
            })
            .addCase(submitReservation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchReservation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReservation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reservation = action.payload;
            })
            .addCase(fetchReservation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserReservations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserReservations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userReservations = action.payload;
            })
            .addCase(fetchUserReservations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.userReservations = state.userReservations.filter(reservation => reservation.reservationId !== action.payload);
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                console.error("Error in deleting reservation:", action.error.message);
            })
            .addCase(submitReservationWithKakaoPay.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(submitReservationWithKakaoPay.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reservation = action.payload;
            })
            .addCase(submitReservationWithKakaoPay.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const {
    setSelectedCity,
    setStartDate,
    setEndDate,
    setShowWarning,
    setPersonCount,
    setTotalPrice,
    resetReservation,
} = reservationSlice.actions;

export default reservationSlice.reducer;
