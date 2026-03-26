/* src/pages/Signup.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import authService from '../services/auth';
import { Loader, AlertCircle, Eye, EyeOff } from 'lucide-react';

const inputCls = 'w-full border border-stone-200 bg-stone-50 focus:bg-white px-4 py-3 rounded-xl text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all';

function Signup() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await authService.createAccount(form);
      if (session) {
        const user = await authService.getCurrentUser();
        if (user) { dispatch(login(user)); navigate('/'); }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4 py-14 page-enter">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-bold text-stone-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Gear<span className="text-amber-500">Hive</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-100 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Create your account
          </h1>
          <p className="text-sm text-stone-400 mb-7">
            Already a member?{' '}
            <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-3.5 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={create} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Full name
              </label>
              <input
                id="name" name="name" type="text" required
                placeholder="Amir Khan"
                value={form.name} onChange={onChange}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="email" name="email" type="email" required
                placeholder="you@example.com"
                value={form.email} onChange={onChange}
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Password <span className="text-stone-300 font-normal normal-case">(min 8 chars)</span>
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPw ? 'text' : 'password'} required minLength={8}
                  placeholder="Create a strong password"
                  value={form.password} onChange={onChange}
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full mt-2 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-stone-900/15"
            >
              {loading ? <><Loader className="animate-spin" size={16} /> Creating account…</> : 'Create account'}
            </button>

            <p className="text-center text-xs text-stone-300 pt-1">
              By signing up you agree to our terms & privacy policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
