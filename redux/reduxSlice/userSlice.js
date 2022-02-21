import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: "joash",
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        updateUser: (state) => {
            state.users = "user";
        }

    },
});

export const { updateUser } = usersSlice.actions;

export default usersSlice.reducer; 