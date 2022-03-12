import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { database } from '../../firebase/firebaseConfig';
import { ref, child, get } from 'firebase/database';
import data from '../../data.json';

// const hotelRef = ref(database);

//FIREBASE FUNCTIONS
//GETTING HOTEL DATA---------------------------------------------------------------
export const getHotel = createAsyncThunk('hotel/getData', async () => {
    const databasePath = 'HOTEL-RESERVATION-SYSTEM/HOTELS';
    let data = {};
    await get(child(hotelRef, databasePath))
        .then((snapshot) => {
            snapshot.exists() ? data = { ...snapshot.val() } : null;
        })
        .catch((err) => {
            console.log(err);
        });
    return data;
});

//INITIAL STATE------------------------------------------------------------------
const initialState = {
    hotelList: { ...data['HOTEL-RESERVATION-SYSTEM']['HOTELS'] },
    status: null,
}

//REDUX REDUCERS AND ACTIONS--------------------------------------------------------
export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getHotel.pending]: (state) => {
            state.status = 'Loading';
        },

        [getHotel.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.hotelList = payload;
        },

        [getHotel.rejected]: (state) => {
            state.status = 'failed';
        },
    }
});

export default hotelSlice.reducer;