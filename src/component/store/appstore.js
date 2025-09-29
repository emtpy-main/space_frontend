import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import feedReducer from './feedSlice'
import requestReducer from './requestSlice'
import connectionReducer from './connectionsSlice'
const appstore = configureStore({
    reducer : {
       user : userReducer,
       feed : feedReducer,
       connection : connectionReducer,
       request : requestReducer,
    },
})

export default appstore;