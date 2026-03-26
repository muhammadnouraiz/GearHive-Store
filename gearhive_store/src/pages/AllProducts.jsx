/* src/pages/AllProducts.jsx */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import databaseService from '../services/database';
import { Query } from 'appwrite';
import { ArrowRight, PackageSearch } from 'lucide-react';

const CATEGORIES = [
  { id: 'all',       name: 'All' },
  { id: 'phones',    name: 'Phones' },
  { id: 'laptops',   name: 'Laptops' },
  { id: 'audio',     name: 'Audio' },
  { id: 'wearables', name: 'Wearables' },
  { id: 'cameras',   name: 'Cameras' },
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
      <div className="skeleton aspect-4/3" />
      <div className="p-5 space-y-2">
        <div className="skeleton h-3 w-1/4" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-5 w-1/3 mt-3" />
      </div>
    </div>
  );
}

function AllProducts() {
  const [products,          setProducts]          = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [selectedCategory,  setSelectedCategory]  = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queries = [Query.equal('status', true)];
        if (selectedCategory !== 'all') queries.push(Query.equal('category', selectedCategory));
        const response = await databaseService.getProducts(queries);
        if (response) setProducts(response.documents);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const categoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.name ?? 'All';

  return (
    <div className="page-enter">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-14">

        {/* ── Page header ──────────────────────────────── */}
        <div className="mb-8">
          <p className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-1">Browse</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h1 className="text-4xl font-bold text-stone-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              Shop Gear
            </h1>
            {!loading && (
              <p className="text-stone-400 text-sm">
                <span className="font-semibold text-stone-700">{products.length}</span> results
                {selectedCategory !== 'all' && (
                  <> in <span className="text-amber-600 font-semibold">{categoryLabel}</span></>
                )}
              </p>
            )}
          </div>
        </div>

        {/* ── Category filter pills ─────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-stone-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                ${selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Product grid ─────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-28 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-200">
            <PackageSearch size={52} className="text-stone-300 mb-4" />
            <p className="text-xl font-bold text-stone-800 mb-1">No products found</p>
            <p className="text-stone-400 text-sm mb-6">Try a different category filter.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold"
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const outOfStock = !product.quantity || product.quantity < 1;
              return (
                <Link
                  key={product.$id}
                  to={`/product/${product.$id}`}
                  className={`group relative flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden transition-all duration-300
                    ${outOfStock ? 'opacity-70' : 'hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/6 hover:-translate-y-0.5'}`}
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 bg-stone-50 overflow-hidden p-5 flex items-center justify-center">
                    <img
                      src={databaseService.getFileView(product.featuredImage)}
                      alt={product.name}
                      className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500
                        ${outOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                    />
                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                        <span className="bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
                          Sold out
                        </span>
                      </div>
                    )}
                    {!outOfStock && product.quantity <= 5 && (
                      <div className="absolute top-3 left-3 bg-rose-50 text-rose-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-100">
                        Only {product.quantity} left
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                      {product.category || 'Gear'}
                    </p>
                    <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors flex-1 mb-3">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-stone-900">${product.price}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-300 group-hover:text-amber-500 transition-colors">
                        Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
