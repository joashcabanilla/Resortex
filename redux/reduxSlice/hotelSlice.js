import { createSlice } from '@reduxjs/toolkit'
import firebase from '../../firebase/firebaseConfig';

const initialState = {
    hotel: [],
}

const database = firebase();

export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        getHotelData: (state) => {
            
        },

    },
});

export const { getHotelData } = hotelSlice.actions;

export default hotelSlice.reducer;