/* src/store/cartSlice.js */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // Start empty. App.jsx will load the correct data.
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item.$id === product.$id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
            // Note: No localStorage saving here anymore
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.$id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.$id === id);
            if (item) {
                item.quantity = quantity > 0 ? quantity : 1;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        // ✅ NEW ACTION: Allows App.jsx to swap the cart contents
        replaceCart: (state, action) => {
            state.items = action.payload;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, replaceCart } = cartSlice.actions;
export default cartSlice.reducer;