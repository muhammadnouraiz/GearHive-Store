/* src/pages/AllProducts.jsx */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import databaseService from '../services/database';
import { Query } from 'appwrite';
import { Loader, Filter, AlertCircle } from 'lucide-react';

function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'phones', name: 'Phones' },
        { id: 'laptops', name: 'Laptops' },
        { id: 'audio', name: 'Audio' },
        { id: 'wearables', name: 'Wearables' },
        { id: 'cameras', name: 'Cameras' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let queries = [Query.equal('status', true)];
                if (selectedCategory !== 'all') {
                    queries.push(Query.equal('category', selectedCategory));
                }

                const response = await databaseService.getProducts(queries);
                if (response) {
                    setProducts(response.documents);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* --- Page Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-gray-100 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                            Shop Gear
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {products.length} results for "<span className="text-blue-700">{categories.find(c => c.id === selectedCategory)?.name}</span>"
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
                    
                    {/* --- Sidebar (Filters) --- */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="sticky top-28">
                            <div className="mb-6 flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-sm">
                                <Filter size={16} />
                                <h3>Filters</h3>
                            </div>
                            
                            <div className="space-y-1">
                                <ul className="space-y-2">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                    selectedCategory === category.id
                                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                                        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* --- Product Grid --- */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                <Loader className="animate-spin mb-4 text-blue-600" size={40} />
                                <p className="font-medium">Loading gear...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                                {products.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center text-center text-slate-500 py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                        <AlertCircle size={48} className="text-slate-300 mb-4" />
                                        <p className="text-xl font-bold text-slate-900 mb-2">No products found</p>
                                        <p className="text-sm">Try adjusting your category filter.</p>
                                    </div>
                                ) : (
                                    products.map((product) => {
                                        const isOutOfStock = !product.quantity || product.quantity < 1;

                                        return (
                                            <Link 
                                                to={`/product/${product.$id}`}
                                                key={product.$id} 
                                                className={`group relative flex flex-col bg-white rounded-2xl transition-all duration-300 ${isOutOfStock ? '' : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/5'}`}
                                            >
                                                {/* Product Image */}
                                                <div className="relative aspect-4/3 bg-gray-50 rounded-2xl overflow-hidden p-6 flex items-center justify-center border border-gray-100">
                                                    <img 
                                                        src={databaseService.getFileView(product.featuredImage)} 
                                                        alt={product.name}
                                                        className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
                                                    />
                                                    {/* Stock Badge */}
                                                    {isOutOfStock && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                                                                Sold Out
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Product Info */}
                                                <div className="pt-6 pb-2 flex flex-col flex-1 px-2">
                                                    <div className="mb-2">
                                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                                                            {product.category || "Gear"}
                                                        </p>
                                                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                                                            {product.name}
                                                        </h3>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between mt-auto pt-2">
                                                        <span className="block text-2xl font-extrabold text-slate-900">
                                                            ${product.price}
                                                        </span>
                                                        <span className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                            View Details &rarr;
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllProducts;