/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from './services/auth';
import { login, logout } from './store/authSlice';
import { replaceCart } from './store/cartSlice';
import { Routes, Route } from 'react-router-dom';

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
  const userData = useSelector((state) => state.auth.userData);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login(userData));
        else dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      const key = userData ? `cart_${userData.$id}` : 'cart_guest';
      const saved = localStorage.getItem(key);
      dispatch(replaceCart(saved ? JSON.parse(saved) : []));
    }
  }, [userData, loading, dispatch]);

  useEffect(() => {
    if (!loading) {
      const key = userData ? `cart_${userData.$id}` : 'cart_guest';
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
  }, [cartItems, userData, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f4] gap-5">
        {/* Animated logo mark */}
        <div className="relative w-14 h-14">
          <span className="absolute inset-0 rounded-2xl bg-amber-400 opacity-20 animate-ping" />
          <span className="absolute inset-0 rounded-2xl bg-amber-400 flex items-center justify-center">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>G</span>
          </span>
        </div>
        <p className="text-stone-400 text-sm tracking-widest uppercase font-medium">Loading GearHive</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
          <Route path="/products"       element={<AllProducts />} />
          <Route path="/product/:slug"  element={<ProductDetail />} />
          <Route path="/cart"           element={<Cart />} />
          <Route path="/checkout"       element={<Checkout />} />
        </Routes>
      </main>

      <footer className="bg-stone-900 text-stone-400 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Gear<span className="text-amber-400">Hive</span>
          </span>
          <p className="text-sm">© 2026 GearHive. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
