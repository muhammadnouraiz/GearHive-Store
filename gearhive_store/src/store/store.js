/* src/store/store.js */
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import cartSlice from './cartSlice'; // ✅ Import the new slice

const store = configureStore({
    reducer: {
        auth: authSlice,
        cart: cartSlice, // ✅ Register it here
    }
});

export default store;