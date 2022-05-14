import { createSlice } from '@reduxjs/toolkit';
import data from '../../data.json';
import data1 from '../../data1.json';

//INITIAL STATE------------------------------------------------------------------
const initialState = {
    hotelList: { ...data1['HOTEL-RESERVATION-SYSTEM']['HOTELS'] },
    hotelManagerAccount: false,
    reservation: { ...data1['PACKAGE-RESERVATION']['2022-01-0002'] }
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
        updateReferenceStatus: (state, { payload }) => {
            state.reservation[`${payload[0]}`][`${payload[1]}`][`${payload[2]}`][`${payload[3]}`] = "APPROVED";
        },
    },
});

export const { getHotel, showModalHotelManager, getReservation, updateReferenceStatus } = hotelSlice.actions;
export default hotelSlice.reducer;