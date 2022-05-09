import { createSlice } from '@reduxjs/toolkit';
import data from '../../data.json';

//INITIAL STATE------------------------------------------------------------------
const initialState = {
    hotelList: { ...data['HOTEL-RESERVATION-SYSTEM']['HOTELS'] },
    hotelManagerAccount: false,
    reservation: { ...data['PACKAGE-RESERVATION']['2022-01-0001'] }
}

//REDUX REDUCERS AND ACTIONS--------------------------------------------------------
export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        getHotel: (state, { payload }) => {
            state.hotelList = {
                ...state.hotelList,
                ...payload,
            }
        },
        showModalHotelManager: (state, { payload }) => {
            state.hotelManagerAccount = payload;
        },
        getReservation: (state, { payload }) => {
            state.reservation = {
                ...state.reservation,
                ...payload,
            }
        },
    },
});

export const { getHotel, showModalHotelManager, getReservation } = hotelSlice.actions;
export default hotelSlice.reducer;