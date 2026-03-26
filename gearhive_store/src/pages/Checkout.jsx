/* src/pages/Checkout.jsx */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import databaseService from '../services/database';
import {
  CreditCard, CheckCircle, MapPin, Truck,
  AlertCircle, Lock, ArrowLeft,
} from 'lucide-react';

/* ── Labelled field wrapper ───────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasErr) =>
  `w-full bg-white border rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300
   focus:outline-none focus:ring-2 transition-all
   ${hasErr
     ? 'border-rose-300 focus:ring-rose-200'
     : 'border-stone-200 focus:border-amber-400 focus:ring-amber-100'}`;

function Checkout() {
  const cartItems    = useSelector((s) => s.cart.items);
  const subtotal     = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const totalItems   = cartItems.reduce((a, i) => a + i.quantity, 0);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [card,     setCard]     = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvc,      setCvc]      = useState('');
  const [errors,   setErrors]   = useState({});

  /* ── Input formatters ── */
  const handleCard = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCard(v.match(/.{1,4}/g)?.join('-') ?? v);
    if (errors.card) setErrors((p) => ({ ...p, card: null }));
  };
  const handleExpiry = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    setExpiry(v.length >= 3 ? v.slice(0, 2) + '/' + v.slice(2) : v);
    if (errors.expiry) setErrors((p) => ({ ...p, expiry: null }));
  };
  const handleCvc = (e) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 3));
    if (errors.cvc) setErrors((p) => ({ ...p, cvc: null }));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    const yr   = new Date().getFullYear() % 100;
    if (card.replace(/-/g, '').length < 16) errs.card = 'Must be 16 digits.';
    if (cvc.length < 3)                     errs.cvc  = 'Enter 3 digits.';
    if (expiry.length < 5) {
      errs.expiry = 'Incomplete date.';
    } else {
      const [mm, yy] = expiry.split('/').map(Number);
      if (mm < 1 || mm > 12)  errs.expiry = 'Invalid month.';
      else if (yy < yr)        errs.expiry = 'Card has expired.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const fd      = new FormData(e.target);
    const ref     = `GH-${Date.now().toString(36).toUpperCase()}`;

    try {
      const result = await databaseService.createOrder({
        customer_name:  String(fd.get('name')),
        total_amount:   parseFloat(subtotal.toFixed(2)),
        status:         'Processing',
        payment_status: 'Paid',
        items_count:    totalItems,
        address:        String(fd.get('address')),
      });
      if (!result) throw new Error('Order creation failed.');

      await Promise.all(
        cartItems.map(async (item) => {
          const p = await databaseService.getProduct(item.$id);
          if (p) {
            const newQty = p.quantity - item.quantity;
            if (newQty >= 0) await databaseService.updateProductStock(item.$id, newQty);
          }
        })
      );

      dispatch(clearCart());
      setOrderRef(ref);
      setSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Empty cart guard ── */
  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#f8f7f4]">
        <p className="text-lg font-bold text-stone-800">Your cart is empty.</p>
        <Link to="/products" className="text-amber-600 font-semibold underline">Return to shop</Link>
      </div>
    );
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4 page-enter">
        <div className="text-center max-w-md w-full bg-white rounded-3xl p-10 border border-stone-100 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Order placed!
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            Thanks for your purchase. Your gear is on its way.
          </p>
          <div className="bg-stone-50 rounded-xl px-5 py-4 mb-6 text-left">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1">Order reference</p>
            <p className="text-stone-900 font-mono font-bold text-lg">{orderRef}</p>
          </div>
          <p className="text-xs text-stone-300">Redirecting to home in a moment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter bg-[#f8f7f4] min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 md:py-14">

        {/* Back link */}
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-8">
          <ArrowLeft size={15} /> Back to cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-10" style={{ fontFamily: 'Syne, sans-serif' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* ── Form ─────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={17} className="text-amber-500" />
                <h2 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Shipping details
                </h2>
              </div>

              <Field label="Full name">
                <input name="name" required placeholder="Amir Khan" className={inputCls(false)} />
              </Field>
              <Field label="Street address">
                <input name="address" required placeholder="123 Tech Street" className={inputCls(false)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City">
                  <input required placeholder="Karachi" className={inputCls(false)} />
                </Field>
                <Field label="Postal code">
                  <input required placeholder="75500" className={inputCls(false)} />
                </Field>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={17} className="text-amber-500" />
                <h2 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Payment
                </h2>
                <span className="ml-auto flex items-center gap-1 text-xs text-stone-400">
                  <Lock size={11} /> Secure
                </span>
              </div>

              <Field label="Card number" error={errors.card}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000-0000-0000-0000"
                  value={card}
                  onChange={handleCard}
                  className={inputCls(!!errors.card)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" error={errors.expiry}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiry}
                    className={inputCls(!!errors.expiry)}
                  />
                </Field>
                <Field label="CVC" error={errors.cvc}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvc}
                    onChange={handleCvc}
                    className={inputCls(!!errors.cvc)}
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Lock size={15} />
              {loading ? 'Processing…' : `Pay $${subtotal.toFixed(2)}`}
            </button>
          </form>

          {/* ── Order review ─────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <Truck size={17} className="text-amber-500" />
              <h2 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                Order review
              </h2>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.$id} className="flex items-center gap-3 text-sm">
                  <div className="h-11 w-11 bg-stone-50 rounded-lg border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                    <img src={databaseService.getFileView(item.featuredImage)} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-400 text-xs">Qty {item.quantity}</p>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span><span className="text-stone-800 font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping</span><span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100 text-base">
                <span>Total</span><span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
