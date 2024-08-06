import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userEditActions } from '../user/UserEditSlice';
import { ROOM_URL, NOTICE_URL } from "../../../config/user/host-config";

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
    async ({ city, startDate, endDate }, thunkAPI) => {
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();

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
    async ({ reservationId }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('userData')).token;
            const response = await fetch(`http://localhost:8888/api/reservation/${reservationId}`, {
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
    async ({ userId }, { rejectWithValue, dispatch }) => {
        try {
            const token = JSON.parse(localStorage.getItem('userData')).token;
            const response = await fetch(`http://localhost:8888/api/reservation/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user reservations');
            }
            const reservations = await response.json();

            // 예약정보에 등록된 호텔아이디와 유저 아이디로 호텔정보, 룸 정보 가져오기.
            const detailedReservations = await Promise.all(reservations.map(async (reservation) => {
                const [hotelResponse, roomResponse] = await Promise.all([
                    fetch(`http://localhost:8888/hotel/${reservation.hotelId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch(`http://localhost:8888/room/${reservation.roomId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                ]);

                if (hotelResponse.ok && roomResponse.ok) {
                    const hotel = await hotelResponse.json();
                    const room = await roomResponse.json();
                    return { ...reservation, hotel, room };
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

export const submitReservation = createAsyncThunk(
    'reservation/submitReservation',
    async ({ hotelId, roomId, startDate, endDate, userId, totalPrice, user, email, token, createdAt, hotelName}, { rejectWithValue, dispatch }) => {
        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            const response = await fetch('http://localhost:8888/api/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelId,
                    roomId,
                    reservationAt: startDate,
                    reservationEndAt: endDate,
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
} = reservationSlice.actions;

export default reservationSlice.reducer;
