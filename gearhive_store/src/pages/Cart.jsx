/* src/pages/Cart.jsx */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import databaseService from '../services/database';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

function Cart() {
  const cartItems = useSelector((s) => s.cart.items);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total    = subtotal; // free shipping

  /* ── Empty state ─────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#f8f7f4] page-enter">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-6">
          <ShoppingBag size={36} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Your cart is empty
        </h2>
        <p className="text-stone-400 mb-8 max-w-xs text-sm">
          You haven't added any gear yet. Head to the shop and find something you love.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
        >
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-enter bg-[#f8f7f4] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 md:py-14">

        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-10" style={{ fontFamily: 'Syne, sans-serif' }}>
          Shopping cart
          <span className="ml-3 text-lg font-normal text-stone-400">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Cart items ──────────────────────────── */}
          <div className="flex-1 space-y-4 w-full">
            {cartItems.map((item) => (
              <div
                key={item.$id}
                className="flex gap-5 bg-white rounded-2xl p-5 border border-stone-100"
              >
                {/* Image */}
                <div className="h-24 w-24 shrink-0 bg-stone-50 rounded-xl border border-stone-100 p-2 flex items-center justify-center">
                  <img
                    src={databaseService.getFileView(item.featuredImage)}
                    alt={item.name}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">
                        {item.category || 'Gear'}
                      </p>
                      <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-base font-bold text-stone-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.$id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease"
                        className="h-8 w-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 text-sm font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.$id, quantity: item.quantity + 1 }))}
                        aria-label="Increase"
                        className="h-8 w-8 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="text-xs text-stone-400">${item.price} each</p>

                    {/* Remove */}
                    <button
                      onClick={() => dispatch(removeFromCart(item.$id))}
                      aria-label={`Remove ${item.name}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order summary ───────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-stone-900 mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
                Order summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between">
                <span className="font-bold text-stone-900">Total</span>
                <span className="text-xl font-bold text-stone-900">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-stone-900/15"
              >
                Proceed to checkout <ArrowRight size={16} />
              </button>

              <Link
                to="/products"
                className="block text-center mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Continue shopping
              </Link>

              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                <ShieldCheck size={13} className="text-amber-500" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
