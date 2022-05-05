import { createSlice } from '@reduxjs/toolkit';
import data from '../../data.json';

const initialState = {
    userList: {},
    hotelManagerAcct: { ...data['ADMIN']['HOTEL-MANAGER'] },
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUser: (state, { payload }) => {
            state.userList = {
                ...payload,
            }
        },

        addUser: (state, { payload }) => {
            state.userList = {
                ...state.userList,
                ...payload,
            };
        },

        getHotelManager: (state, { payload }) => {
            state.hotelManagerAcct = {
                ...state.hotelManagerAcct,
                ...payload,
            }
        },

        addHotelManager: (state, { payload }) => {
            state.hotelManagerAcct = {
                ...state.hotelManagerAcct,
                ...payload,
            }
        }
    },
});

export const { getUser, addUser, getHotelManager, addHotelManager } = usersSlice.actions;
export default usersSlice.reducer; 