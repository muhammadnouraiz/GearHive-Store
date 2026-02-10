/* src/components/layout/Navbar.jsx */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, LogOut, Home, Grid, Menu, X } from 'lucide-react';
import authService from '../../services/auth';
import { logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice'; // ✅ 1. Import clearCart

function Navbar() {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const cartItems = useSelector((state) => state.cart.items);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authService.logout();
            
            // ✅ 2. Clear the cart BEFORE logging out the user
            dispatch(clearCart()); 
            
            dispatch(logout());
            navigate('/login');
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'All Products', path: '/products', icon: <Grid size={18} /> },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-6 h-20">
                <div className="flex justify-between items-center h-full">
                    
                    {/* --- Logo --- */}
                    <div className="shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                            Gear<span className="text-blue-700">Hive</span>
                        </Link>
                    </div>

                    {/* --- Desktop Navigation --- */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-blue-700' 
                                            : 'text-slate-600 hover:text-blue-700'
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* --- Right Side: Cart & Auth --- */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Cart Icon */}
                        <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-700 transition-colors">
                            <ShoppingBag size={20} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-200"></div>

                        {/* Auth Section */}
                        {authStatus ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    {/* User Avatar Placeholder */}
                                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-slate-600">
                                        <User size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 hidden lg:block">
                                        Hi, {userData?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full"
                                >
                                    <LogOut size={14} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-slate-900/20"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="flex items-center md:hidden gap-4">
                         {/* Mobile Cart Link */}
                         <Link to="/cart" className="relative text-slate-600">
                            <ShoppingBag size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 -mr-2 text-slate-600 hover:text-slate-900"
                        >
                            <span className="sr-only">Open menu</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Dropdown Menu --- */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 absolute w-full left-0 top-20 shadow-xl animate-in slide-in-from-top-2">
                    <div className="px-6 py-6 space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 text-lg font-medium p-2 rounded-lg ${
                                        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}

                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                            {authStatus ? (
                                <>
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{userData?.name || 'User'}</p>
                                            <p className="text-xs text-slate-500">Logged in</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-slate-700 font-semibold hover:bg-gray-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;