import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";
import reservationReducer from "./hotel/ReservationSlice"
import hotelPageReducer from "./hotel/HotelPageSlice";

const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer,
        reservation: reservationReducer,
        hotelPage: hotelPageReducer,
    }
});

export default store;