import { createSlice } from '@reduxjs/toolkit';
import data from '../../data.json';
import data1 from '../../data1.json';

const initialState = {
    userList: {},
    hotelManagerAcct: {},
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
        },

        updateManagerAccount: (state, {payload}) => {
            state.hotelManagerAcct[`${payload[0]}`] = {
                "ID": payload[0],
                "FIRSTNAME": payload[1],
                "MIDDLENAME": payload[2],
                "LASTNAME": payload[3],
                "USERNAME": payload[4],
                "PASSWORD": payload[5]
            }
        }
    },
});

export const { getUser, addUser, getHotelManager, addHotelManager, updateManagerAccount } = usersSlice.actions;
export default usersSlice.reducer; 