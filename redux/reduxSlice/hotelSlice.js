import { createSlice } from '@reduxjs/toolkit';
import data from '../../data.json';

//INITIAL STATE------------------------------------------------------------------
const initialState = {
    hotelList: { ...data['HOTEL-RESERVATION-SYSTEM']['HOTELS'] },
    hotelManagerAccount: false,
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
    },
});

export const { getHotel, showModalHotelManager } = hotelSlice.actions;
export default hotelSlice.reducer;