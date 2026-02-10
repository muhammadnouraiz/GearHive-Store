/* src/pages/Home.jsx */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Loader } from 'lucide-react';
import databaseService from '../services/database';
import { Query } from 'appwrite'; // ✅ Import Query

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // ✅ FIX: Use Appwrite Query to match AllProducts.jsx logic
                // 1. Get products where status is true (Boolean)
                // 2. Limit to 4 items for the home page
                const queries = [
                    Query.equal('status', true),
                    Query.limit(4)
                ];

                const response = await databaseService.getProducts(queries);
                
                if (response) {
                    setProducts(response.documents);
                }
            } catch (error) {
                console.error("Home: Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatest();
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            
            {/* --- Hero Section --- */}
            <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-24 md:pb-32">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Hero Text */}
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                            Next-Gen Tech, <br />
                            <span className="text-blue-700">Delivered Today.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                            Upgrade your setup with the latest gear from GearHive. 
                            Premium quality, verified authentic, and shipped directly to your door.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link 
                                to="/products" 
                                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-700/20 transition-all hover:scale-105 active:scale-95"
                            >
                                Shop All Products
                                <ChevronRight size={20} />
                            </Link>
                            
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 w-full relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 bg-gray-100 aspect-4/3 md:aspect-square lg:aspect-4/3">
                            <img 
                                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop" 
                                alt="Next Gen Tech" 
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        {/* Decorative Blur behind image */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* --- Featured Products Grid --- */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Latest Drops</h2>
                    <Link to="/products" className="hidden md:flex items-center gap-1 text-blue-700 font-semibold hover:gap-2 transition-all">
                        View Collection <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader className="animate-spin mb-4" size={32} />
                        <p>Loading new gear...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center text-slate-400 py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-lg font-medium">No products available yet.</p>
                                <p className="text-sm">Check back soon for new inventory.</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <Link 
                                    to={`/product/${product.$id}`}
                                    key={product.$id} 
                                    className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    {/* Product Image Area */}
                                    <div className="relative aspect-square bg-gray-50 overflow-hidden p-6 flex items-center justify-center">
                                        <img 
                                            src={databaseService.getFileView(product.featuredImage)} 
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-3">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                                {product.category || "Gear"}
                                            </p>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex items-end justify-between mt-auto">
                                            <div>
                                                <span className="block text-2xl font-bold text-slate-900">${product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
                
                <div className="mt-12 text-center md:hidden">
                     <Link to="/products" className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                        View Full Collection <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;