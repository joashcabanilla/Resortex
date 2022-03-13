import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { database } from '../../firebase/firebaseConfig';
import { ref, child, get } from 'firebase/database';

// const hotelRef = ref(database);

//FIREBASE FUNCTIONS
//get userdata
export const getUser = createAsyncThunk('user/getData', async () => {
    const databasePath = 'HOTEL-RESERVATION-SYSTEM/USERS';
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

//get hotel manager account
export const getHotelManager = createAsyncThunk('manager/getData', async () => {
    const databasePath = 'ADMIN/HOTEL-MANAGER';
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

//get admin account
export const getAdminAccount = createAsyncThunk('admin/getData', async () => {
    const databasePath = 'ADMIN/ACCOUNT';
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

const initialState = {
    userList: {},
    status: null,
    hotelManagerAcct: {},
    adminList: {},
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: {
        //get user account
        [getUser.pending]: (state) => {
            state.status = 'Loading';
        },

        [getUser.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.userList = payload;
        },

        [getUser.rejected]: (state) => {
            state.status = 'failed';
        },

        //get hotel manager account
        [getHotelManager.pending]: (state) => {
            state.status = 'Loading';
        },

        [getHotelManager.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.hotelManagerAcct = payload;
        },

        [getHotelManager.rejected]: (state) => {
            state.status = 'failed';
        },

        //get admin account
        [getAdminAccount.pending]: (state) => {
            state.status = 'Loading';
        },

        [getAdminAccount.fulfilled]: (state, { payload }) => {
            state.status = 'success';
            state.adminList = payload;
        },

        [getAdminAccount.rejected]: (state) => {
            state.status = 'failed';
        },
    }
});

export default usersSlice.reducer; 