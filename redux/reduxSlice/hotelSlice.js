import { createSlice } from '@reduxjs/toolkit'
import { database } from '../../firebase/firebaseConfig';
import { ref, child, get } from 'firebase/database';

const hotelRef = ref(database)
let databasePath = "";

const initialState = {
    hotel: [],
}

export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
        getHotelData: (state) => {
            getHotel();
        },
    },
});

//FIREBASE FUNCTIONS 
const getHotel = () => {
    databasePath = 'HOTEL-RESERVATION-SYSTEM/HOTELS';
    get(child(hotelRef, databasePath))
        .then((snapshot) => {
            snapshot.exists() ? console.log(snapshot.val()) : null;
        })
        .catch((err) => {
            console.log(err);
        });
}
export const { getHotelData } = hotelSlice.actions;

export default hotelSlice.reducer;