/* src/components/layout/Navbar.jsx */
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'; // Removed Search icon
import authService from '../../services/auth';
import { logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';

function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData   = useSelector((state) => state.auth.userData);
  const cartItems  = useSelector((state) => state.cart.items);
  const totalQty   = cartItems.reduce((s, i) => s + i.quantity, 0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Close mobile menu on route change */
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  /* Compact navbar on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(clearCart());
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navItems = [
    { name: 'Home',         path: '/' },
    { name: 'All Products', path: '/products' },
  ];

  const linkCls = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 pb-0.5
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300
     ${isActive
       ? 'text-stone-900 after:w-full after:bg-amber-400'
       : 'text-stone-500 hover:text-stone-800 after:w-0 hover:after:w-full after:bg-amber-300'}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_#e7e3db]'
          : 'bg-[#f8f7f4]/80 backdrop-blur-md border-b border-stone-200/60'}`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ──────────────────────────────────── */}
        <Link
          to="/"
          className="text-xl font-bold text-stone-900 shrink-0 tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Gear<span className="text-amber-500">Hive</span>
        </Link>

        {/* ── Desktop nav links ─────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.path} className={linkCls} end={item.path === '/'}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* ── Right cluster ────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            aria-label={`Cart, ${totalQty} item${totalQty !== 1 ? 's' : ''}`}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ShoppingBag size={19} />
            {totalQty > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full leading-none">
                {totalQty > 9 ? '9+' : totalQty}
              </span>
            )}
          </Link>

          <div className="h-5 w-px bg-stone-200" />

          {/* Auth */}
          {authStatus ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-1">
                <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                  {userData?.name?.[0]?.toUpperCase() ?? <User size={12} />}
                </div>
                <span className="text-sm font-medium text-stone-700 hidden lg:block">
                  {userData?.name?.split(' ')[0] ?? 'Account'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="h-9 px-3 flex items-center gap-1.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="h-9 px-4 flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="h-9 px-4 flex items-center text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile right ────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            aria-label={`Cart, ${totalQty} items`}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg text-stone-600"
          >
            <ShoppingBag size={20} />
            {totalQty > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {totalQty > 9 ? '9+' : totalQty}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-5 py-5 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors
                   ${isActive ? 'bg-amber-50 text-amber-700' : 'text-stone-700 hover:bg-stone-50'}`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="border-t border-stone-100 pt-4 mt-4">
              {authStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                      {userData?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{userData?.name}</p>
                      <p className="text-xs text-stone-400">Signed in</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold text-sm"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center py-3 rounded-xl border border-stone-200 text-stone-800 font-semibold text-sm hover:bg-stone-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;