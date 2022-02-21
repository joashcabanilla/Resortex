import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: "joash",
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
});

export default usersSlice.reducer; 