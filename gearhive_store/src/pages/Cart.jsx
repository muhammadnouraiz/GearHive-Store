/* src/pages/Cart.jsx */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import databaseService from '../services/database';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

function Cart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 0.00; // Placeholder for free shipping
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white font-sans">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={64} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any gear yet. Explore our collection and find something you love.</p>
                <Link to="/products" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-700/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    Start Shopping <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 tracking-tight">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* --- Cart Items List --- */}
                    <div className="flex-1 space-y-8">
                        {cartItems.map((item) => (
                            <div key={item.$id} className="flex gap-6 py-6 border-b border-gray-100 last:border-0">
                                {/* Product Image */}
                                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center">
                                    <img
                                        src={databaseService.getFileView(item.featuredImage)}
                                        alt={item.name}
                                        className="h-full w-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-1 flex-col justify-between py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1 capitalize">{item.category || 'Gear'}</p>
                                        </div>
                                        <p className="text-xl font-bold text-blue-700">${item.price}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                            <button 
                                                onClick={() => dispatch(updateQuantity({id: item.$id, quantity: item.quantity - 1}))}
                                                disabled={item.quantity <= 1}
                                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-semibold text-slate-900 w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => dispatch(updateQuantity({id: item.$id, quantity: item.quantity + 1}))}
                                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        
                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => dispatch(removeFromCart(item.$id))}
                                            className="flex items-center gap-1 font-medium text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Order Summary --- */}
                    <div className="w-full lg:w-104 h-fit bg-gray-50 rounded-3xl p-8 border border-blue-100/50 shadow-sm sticky top-28">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between text-base font-medium text-slate-600">
                                <p>Subtotal</p>
                                <p className="text-slate-900">${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-slate-600 pb-4 border-b border-gray-200">
                                <p>Shipping</p>
                                <p className="text-slate-900">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-slate-900 pt-4">
                                <p>Total</p>
                                <p className="text-blue-700">${total.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8"
                        >
                            Proceed to Checkout
                        </button>
                        
                        <div className="mt-6 flex justify-center items-center gap-2 text-sm text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
                                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.64-.759-3.985a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.208a12.705 12.705 0 006.93 3.16c.434 3.933-.625 8.063-3.594 10.892a.75.75 0 01-1.078-.023c-2.945-2.8-4.017-6.912-3.604-10.835A12.708 12.708 0 0012 4.208z" clipRule="evenodd" />
                            </svg>
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;