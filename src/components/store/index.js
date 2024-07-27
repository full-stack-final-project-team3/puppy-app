import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";
import dogEditReducer from './dog/DogEditSlice'
import userEditReducer from "./user/UserEditSlice";

const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer,
        dogEdit: dogEditReducer,
        userEdit: userEditReducer,
    }
});

export default store;