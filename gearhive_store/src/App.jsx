/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Added useSelector
import authService from './services/auth';
import { login, logout } from './store/authSlice';
import { replaceCart } from './store/cartSlice'; // ✅ Added replaceCart action
import { Routes, Route } from 'react-router-dom';

// Components & Pages
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // 1. Get User and Cart from Redux to track changes
  const userData = useSelector((state) => state.auth.userData);
  const cartItems = useSelector((state) => state.cart.items);

  // 2. Auth Check (Existing)
  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // ----------------------------------------------------
  // 3. CART SYNC LOGIC (The Fix)
  // ----------------------------------------------------

  // A. LOAD Cart when User Changes (Login/Logout)
  useEffect(() => {
    if (!loading) {
        // Define a unique key: 'cart_user123' or 'cart_guest'
        const storageKey = userData ? `cart_${userData.$id}` : "cart_guest";
        
        // Try to find a saved cart for this specific user
        const savedCart = localStorage.getItem(storageKey);
        
        if (savedCart) {
            // If found, load it into Redux
            dispatch(replaceCart(JSON.parse(savedCart)));
        } else {
            // If not found (new user), start with empty
            dispatch(replaceCart([]));
        }
    }
  }, [userData, loading, dispatch]);

  // B. SAVE Cart whenever Items Change
  useEffect(() => {
    if (!loading) {
        // Define the unique key again
        const storageKey = userData ? `cart_${userData.$id}` : "cart_guest";
        
        // Save the current Redux cart to the browser under that key
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, userData, loading]);

  // ----------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading GearHive...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <Navbar />

      <main className="grow">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <footer className="bg-white border-t p-6 text-center text-sm text-gray-500">
        © 2026 GearHive. All rights reserved.
      </footer>
    </div>
  );
}

export default App;