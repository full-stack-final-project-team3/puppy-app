import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";

import dogEditReducer from './dog/DogEditSlice'
import userEditReducer from "./user/UserEditSlice";

import reservationReducer from "./hotel/ReservationSlice"
import hotelPageReducer from "./hotel/HotelPageSlice";
import reviewReducer from "./hotel/HotelReviewSlice";

const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer,
        dogEdit: dogEditReducer,
        userEdit: userEditReducer,
        reservation: reservationReducer,
        hotelPage: hotelPageReducer,
        reviews: reviewReducer,
    }
});

export default store;