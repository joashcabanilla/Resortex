import { createSlice } from '@reduxjs/toolkit';

//INITIAL STATE------------------------------------------------------------------
const initialState = {
    hotelList: {},
    hotelManagerAccount: false,
    reservation: {}
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
            state.reservation[`${payload[0]}`][`${payload[1]}`][`${payload[2]}`][`${payload[3]}`] = payload[4];
        },
        updateHotelPackage: (state, {payload}) => {
            state.hotelList[`${payload[0]}`][`${payload[1]}`][`${payload[2]}`] = payload[3];
        },
        updateCover: (state, { payload }) => {
            state.hotelList[`${payload[0]}`]['HOTEL-COVER'] = payload[1];
        },
        updateRoom1: (state, { payload }) => {
            state.hotelList[`${payload[0]}`]['VIEW-ROOM GALLERY']['ROOM-01'] = payload[1];
        },
        updateRoom2: (state, { payload }) => {
            state.hotelList[`${payload[0]}`]['VIEW-ROOM GALLERY']['ROOM-02'] = payload[1];
        },
        updateHotelInfo: (state, { payload }) => {
            state.hotelList[`${payload[0]}`]['HOTEL-DESCRIPTION'] = payload[1];
            state.hotelList[`${payload[0]}`]['HOTEL-LOCATION'] = payload[2];
            state.hotelList[`${payload[0]}`]['HOTEL-NAME'] = payload[3];
            state.hotelList[`${payload[0]}`]['ROOMS'] = payload[4];  
        },
    },
});

export const { getHotel, showModalHotelManager, getReservation, updateReferenceStatus, updateHotelPackage, updateCover, updateRoom1, updateRoom2, updateHotelInfo } = hotelSlice.actions;
export default hotelSlice.reducer;