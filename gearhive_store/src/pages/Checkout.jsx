/* src/pages/Checkout.jsx */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import databaseService from '../services/database';
import { CreditCard, CheckCircle, MapPin, Truck, AlertCircle } from 'lucide-react';

function Checkout() {
    const cartItems = useSelector((state) => state.cart.items);
    
    // Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // --- State ---
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Input States
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    
    // Error States
    const [errors, setErrors] = useState({});

    // --- Input Handlers with Formatting ---

    // 1. Card Number: Integers only, 16 digits, auto "-"
    const handleCardChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 16) val = val.slice(0, 16); // Limit to 16 digits
        
        // Add hyphen every 4 digits
        const formatted = val.match(/.{1,4}/g)?.join('-') || val;
        
        setCardNumber(formatted);
        if (errors.card) setErrors({ ...errors, card: null }); // Clear error
    };

    // 2. Expiry: Integers only, "MM/YY" format
    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 4) val = val.slice(0, 4); // Limit to 4 digits (MMYY)

        let formatted = val;
        if (val.length >= 3) {
            formatted = val.slice(0, 2) + '/' + val.slice(2);
        }

        setExpiry(formatted);
        if (errors.expiry) setErrors({ ...errors, expiry: null });
    };

    // 3. CVC: Integers only, length 3
    const handleCvcChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 3) val = val.slice(0, 3);
        
        setCvc(val);
        if (errors.cvc) setErrors({ ...errors, cvc: null });
    };

    // --- Validation Logic ---
    const validatePayment = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear() % 100; // e.g., 26

        // Card Length
        if (cardNumber.replace(/-/g, '').length < 16) {
            newErrors.card = "Card number must be 16 digits.";
        }

        // CVC Length
        if (cvc.length < 3) {
            newErrors.cvc = "Enter 3 digits.";
        }

        // Date Validation
        if (expiry.length < 5) {
            newErrors.expiry = "Incomplete date.";
        } else {
            const [mm, yy] = expiry.split('/');
            const month = parseInt(mm, 10);
            const year = parseInt(yy, 10);

            if (month < 1 || month > 12) {
                newErrors.expiry = "Invalid month (01-12).";
            } else if (year < currentYear) {
                newErrors.expiry = "Card has expired.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Run Validation
        if (!validatePayment()) return;

        setLoading(true);

        const formData = new FormData(e.target);
        const customerName = formData.get("name"); 
        const address = formData.get("address"); 

        try {
            const orderData = {
                customer_name: String(customerName),
                total_amount: parseFloat(subtotal.toFixed(2)),
                status: "Processing",
                payment_status: "Paid",
                items_count: parseInt(totalItemCount), 
                address: String(address),
            };

            const orderResult = await databaseService.createOrder(orderData);
            
            if (!orderResult) throw new Error("Failed to create order.");

            // Update Stock
            const updatePromises = cartItems.map(async (cartItem) => {
                const productInDb = await databaseService.getProduct(cartItem.$id);
                if (productInDb) {
                    const newStock = productInDb.quantity - cartItem.quantity;
                    if (newStock >= 0) {
                        return await databaseService.updateProductStock(cartItem.$id, newStock);
                    }
                }
            });

            await Promise.all(updatePromises);

            setLoading(false);
            setSuccess(true);
            dispatch(clearCart());
            
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (error) {
            console.error("Checkout error:", error);
            alert("Order failed. Please try again.");
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Cart is empty</h2>
                <button onClick={() => navigate('/products')} className="text-blue-700 font-semibold underline">
                    Return to Shop
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-sans">
                <div className="text-center p-12 bg-gray-50 rounded-[2.5rem] shadow-sm max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Order Successful!</h2>
                    <p className="text-slate-600 mb-8">Thank you for your purchase.</p>
                    <p className="text-sm text-slate-400">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12 tracking-tight">Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* --- Payment Form --- */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-blue-700" size={24} />
                            <h2 className="text-xl font-bold text-slate-900">Shipping & Payment</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping Fields */}
                            <div className="space-y-4">
                                <input required type="text" name="name" placeholder="Full Name" 
                                    className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                                />
                                <input required type="text" name="address" placeholder="Address" 
                                    className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="City" 
                                        className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                                    />
                                    <input required type="text" placeholder="Zip Code" 
                                        className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors" 
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-8 mt-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="text-blue-700" size={24} />
                                    <h3 className="text-xl font-bold text-slate-900">Card Details</h3>
                                </div>
                                
                                {/* Card Inputs Container */}
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    
                                    {/* Card Number */}
                                    <div>
                                        <input 
                                            required 
                                            type="text" 
                                            placeholder="0000-0000-0000-0000" 
                                            value={cardNumber}
                                            onChange={handleCardChange}
                                            className={`w-full bg-white border p-4 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${errors.card ? 'border-red-500' : 'border-gray-200'}`} 
                                        />
                                        {errors.card && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.card}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Expiry Date */}
                                        <div>
                                            <input 
                                                required 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                                className={`w-full bg-white border p-4 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${errors.expiry ? 'border-red-500' : 'border-gray-200'}`} 
                                            />
                                            {errors.expiry && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.expiry}</p>}
                                        </div>

                                        {/* CVC */}
                                        <div>
                                            <input 
                                                required 
                                                type="text" 
                                                placeholder="CVC" 
                                                value={cvc}
                                                onChange={handleCvcChange}
                                                className={`w-full bg-white border p-4 rounded-xl focus:outline-none focus:border-blue-600 transition-colors ${errors.cvc ? 'border-red-500' : 'border-gray-200'}`} 
                                            />
                                            {errors.cvc && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.cvc}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-blue-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : `Pay $${subtotal.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    {/* --- Order Review --- */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Truck className="text-blue-700" size={24} />
                            <h2 className="text-xl font-bold text-slate-900">Order Review</h2>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-4xl border border-gray-100">
                            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.$id} className="flex justify-between items-center text-sm py-2 border-b border-gray-200/50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-white rounded-lg p-1 border border-gray-200 shrink-0">
                                                <img src={databaseService.getFileView(item.featuredImage)} alt="" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 border-t border-gray-200 pt-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Total Items</span>
                                    <span className="font-medium text-slate-900">{totalItemCount}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                                <span className="text-xl font-bold text-slate-900">Total Price</span>
                                <span className="text-2xl font-extrabold text-blue-700">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;