import { configureStore } from "@reduxjs/toolkit"
import hotelAddReducer from "./hotel/HotelAddSlice";
import roomAddReducer from "./hotel/RoomAddSlice";

import dogEditReducer from './dog/DogEditSlice'
import userEditReducer from "./user/UserEditSlice";
import userReducer from "./user/UserSlice";
import reservationReducer from "./hotel/ReservationSlice"
import hotelPageReducer from "./hotel/HotelPageSlice";
import reviewReducer from "./hotel/HotelReviewSlice";
import favoriteReducer from "./hotel/FavoriteSlice";
import adminReducer from "./user/AdminSlice";


const store = configureStore({
    reducer: {
        hotelAdd: hotelAddReducer,
        roomAdd: roomAddReducer,
        dogEdit: dogEditReducer,
        userEdit: userEditReducer,
        reservation: reservationReducer,
        hotelPage: hotelPageReducer,
        reviews: reviewReducer,
        user: userReducer,
        favorites: favoriteReducer,
        admin: adminReducer,
    }
});

export default store;