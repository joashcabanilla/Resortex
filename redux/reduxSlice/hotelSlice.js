import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    hotel: [
        {
            name: "hotel1",
            location: "location1"
        },
        {
            name: "hotel2",
            location: "location2"
        }
    ],
}

export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {
    },
});

export default hotelSlice.reducer;