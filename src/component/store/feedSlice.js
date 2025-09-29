import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name : "feed",
    initialState : [], 
    reducers : {
        addFeed : (state,action) => action.payload,
        removeUserFromFeed : (state,action) => {
            const newfeed = state.filter((req) => req._id != action.payload)
            return newfeed;
        },
    }
})

export const {addFeed,removeUserFromFeed} = feedSlice.actions;
export default feedSlice.reducer;