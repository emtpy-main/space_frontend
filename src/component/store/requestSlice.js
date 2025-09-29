import { createSlice } from "@reduxjs/toolkit";

const request = createSlice({
    name : "request",
    initialState : [],
    reducers : {
        addRequest : (state,action) => action.payload,
        removeRequest : (state,action) =>{
            const newArray = state.filter( r => r._id !== action.payload);
            return newArray;
        }
    }
})

export const {addRequest,removeRequest} = request.actions;

export default request.reducer;