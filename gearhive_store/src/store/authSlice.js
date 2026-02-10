/* src/store/authSlice.js */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false, // true if user is logged in
    userData: null // holds the user object
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;