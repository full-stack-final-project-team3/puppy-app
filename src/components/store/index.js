import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";

import dogEditReducer from './dog/DogEditSlice'
import userEditReducer from "./user/UserEditSlice";

import reservationReducer from "./hotel/ReservationSlice"
import hotelPageReducer from "./hotel/HotelPageSlice";


const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer,
        dogEdit: dogEditReducer,
        userEdit: userEditReducer,
        reservation: reservationReducer,
        hotelPage: hotelPageReducer,
    }
});

export default store;