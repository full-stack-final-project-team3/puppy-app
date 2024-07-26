import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";

const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer
    }
});

export default store;