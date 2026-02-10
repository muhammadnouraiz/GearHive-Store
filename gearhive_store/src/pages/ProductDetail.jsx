/* src/pages/ProductDetail.jsx */
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import databaseService from '../services/database';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Loader, Check } from 'lucide-react'; // Added Check icon

function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false); // ✅ State for popup
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (slug) {
            databaseService.getProduct(slug).then((data) => {
                if (data) setProduct(data);
            }).finally(() => setLoading(false));
        }
    }, [slug]);

    const handleAddToCart = () => {
        // 1. Check Auth
        if (!authStatus) {
            const confirmLogin = window.confirm("You must be logged in to shop. Go to Login?");
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        // 2. Add to Cart & Show Toast
        if (product && product.quantity > 0) {
            dispatch(addToCart(product));
            
            // ✅ Show the "Added to cart" popup
            setShowToast(true);
            
            // ✅ Hide it after 3 seconds
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
            <Link to="/all-products" className="mt-4 text-blue-600 hover:underline font-medium">Back to Shop</Link>
        </div>
    );

    const isOutOfStock = !product.quantity || product.quantity < 1;

    return (
        <div className="min-h-screen bg-white font-sans relative"> {/* Added relative for positioning context if needed */}
            
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 items-start">
                    
                    {/* Image Section */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
                        <img 
                            src={databaseService.getFileView(product.featuredImage)} 
                            alt={product.name}
                            className={`w-auto h-auto max-w-full max-h-112.5 object-contain mix-blend-multiply ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
                        />
                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-[2px]">
                                <span className="bg-white text-slate-900 px-6 py-2 font-bold text-lg uppercase tracking-widest rounded-full shadow-lg">
                                    Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="lg:col-span-3 flex flex-col justify-start lg:py-4">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
                            {product.category || "Wearables"}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-blue-600 mb-8">
                            ${product.price}
                        </p>
                        <h2 className="text-lg font-bold text-slate-900 mb-3">
                            Description
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed mb-10">
                            {product.description || "No description available for this product."}
                        </p>

                        <button 
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`w-full py-4 px-8 rounded-xl text-lg font-bold text-white transition-all duration-300
                                ${isOutOfStock 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                                }`
                            }
                        >
                            {isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ The Tiny Pop-up (Toast) */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                        <div className="bg-green-500 rounded-full p-1">
                            <Check size={14} strokeWidth={3} className="text-white" />
                        </div>
                        <span className="font-semibold text-sm">Added to cart</span>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProductDetail;