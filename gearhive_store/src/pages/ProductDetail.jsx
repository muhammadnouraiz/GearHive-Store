/* src/pages/ProductDetail.jsx */
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import databaseService from '../services/database';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import {
  Loader, Check, ShoppingBag, ArrowLeft,
  Truck, ShieldCheck, RotateCcw, Minus, Plus, X,
} from 'lucide-react';

/* ── Auth-nudge modal (replaces window.confirm) ───────────── */
function AuthModal({ onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <ShoppingBag size={20} />
          </div>
          <button onClick={onClose} aria-label="Close" className="text-stone-400 hover:text-stone-700">
            <X size={20} />
          </button>
        </div>
        <h2 id="auth-modal-title" className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Sign in to shop
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          You need to be logged in to add items to your cart.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Trust badge ──────────────────────────────────────────── */
function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-stone-500 text-xs">
      <Icon size={14} className="text-amber-500 shrink-0" />
      {label}
    </div>
  );
}

function ProductDetail() {
  const { slug }        = useParams();
  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [qty,           setQty]           = useState(1);
  const [showToast,     setShowToast]     = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const authStatus  = useSelector((s) => s.auth.status);

  useEffect(() => {
    if (!slug) return;
    databaseService.getProduct(slug)
      .then((data) => { if (data) setProduct(data); })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!authStatus) { setShowAuthModal(true); return; }
    if (!product || product.quantity < 1) return;
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <Loader className="animate-spin text-amber-500" size={36} />
    </div>
  );

  /* ── Not found ── */
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8f7f4]">
      <p className="text-xl font-bold text-stone-800">Product not found</p>
      <Link to="/products" className="text-amber-600 font-semibold underline underline-offset-2">
        Back to shop
      </Link>
    </div>
  );

  const outOfStock = !product.quantity || product.quantity < 1;

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onConfirm={() => { setShowAuthModal(false); navigate('/login'); }}
        />
      )}

      <div className="page-enter min-h-screen bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8 md:py-12">

          {/* ── Breadcrumb ──────────────────────────── */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-stone-400 mb-8">
            <Link to="/" className="hover:text-stone-700 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-stone-700 transition-colors">All products</Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-stone-500 capitalize">{product.category}</span>
              </>
            )}
            <span>/</span>
            <span className="text-stone-700 font-medium line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* ── Image panel ─────────────────────── */}
            <div className="relative bg-white rounded-3xl p-10 flex items-center justify-center border border-stone-100 aspect-square overflow-hidden">
              <img
                src={databaseService.getFileView(product.featuredImage)}
                alt={product.name}
                className={`max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-500
                  ${outOfStock ? 'grayscale opacity-40' : 'hover:scale-105'}`}
              />
              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                  <span className="bg-stone-900 text-white text-sm font-bold px-6 py-2.5 rounded-full tracking-widest uppercase">
                    Sold out
                  </span>
                </div>
              )}
              {/* Back link */}
              <Link
                to="/products"
                className="absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition-colors shadow-sm"
                aria-label="Back to products"
              >
                <ArrowLeft size={16} />
              </Link>
            </div>

            {/* ── Info panel ──────────────────────── */}
            <div className="flex flex-col justify-start py-2 space-y-6">

              {/* Category + stock */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                  {product.category || 'Gear'}
                </span>
                {!outOfStock && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    In stock · {product.quantity} left
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-stone-900">${product.price}</span>
                <span className="text-stone-400 text-sm">+ free shipping</span>
              </div>

              {/* Description */}
              <p className="text-stone-500 leading-relaxed text-[15px]">
                {product.description || 'No description available for this product.'}
              </p>

              {/* Qty stepper */}
              {!outOfStock && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-stone-700">Quantity</label>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-white overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                      className="h-10 w-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors disabled:opacity-30"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-10 text-center font-bold text-stone-900 text-sm">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                      disabled={qty >= product.quantity}
                      aria-label="Increase quantity"
                      className="h-10 w-10 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors disabled:opacity-30"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`w-full py-4 px-8 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all duration-200
                  ${outOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-900/20 active:scale-[0.98]'}`}
              >
                <ShoppingBag size={18} />
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-100">
                <TrustBadge icon={Truck}       label="Free shipping" />
                <TrustBadge icon={ShieldCheck} label="2-yr warranty" />
                <TrustBadge icon={RotateCcw}   label="30-day returns" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 z-50 toast-enter"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold whitespace-nowrap">
            <span className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check size={12} strokeWidth={3} />
            </span>
            Added to cart
            <Link to="/cart" className="text-amber-400 hover:text-amber-300 ml-1 underline underline-offset-2">
              View cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetail;
