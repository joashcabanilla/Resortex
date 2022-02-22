import { configureStore, combineReducers } from '@reduxjs/toolkit'
import hotelSlice from './reduxSlice/hotelSlice'
import usersSlice from './reduxSlice/userSlice';

const reducer = combineReducers({
    storeHotel: hotelSlice,
    storeUsers: usersSlice,
});

const store = configureStore({
    reducer,
});

export default store;