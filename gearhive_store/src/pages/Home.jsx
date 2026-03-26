/* src/pages/Home.jsx */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import databaseService from '../services/database';
import { Query } from 'appwrite';

/* ── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
      <div className="skeleton aspect-square" />
      <div className="p-5 space-y-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-5 w-1/4 mt-3" />
      </div>
    </div>
  );
}

/* ── Trust pill ────────────────────────────────────────────── */
function TrustPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-stone-500 text-sm">
      <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
        <Icon size={15} />
      </div>
      {label}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await databaseService.getProducts([
          Query.equal('status', true),
          Query.limit(4),
        ]);
        if (response) setProducts(response.documents);
      } catch (err) {
        console.error('Home: Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="page-enter">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Text side */}
          <div className="flex-1 space-y-7 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-amber-700 text-sm font-medium mx-auto lg:mx-0">
              <Zap size={13} className="fill-amber-500 text-amber-500" />
              New drops every week
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.05] tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Next-gen tech,{' '}
              <span className="relative inline-block">
                <span className="text-amber-500">delivered</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3px bg-amber-300 rounded-full opacity-60" />
              </span>
              <br />today.
            </h1>

            <p className="text-lg text-stone-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Upgrade your setup with the latest gear — premium quality, verified
              authentic, shipped directly to your door.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-stone-900/20 active:scale-[0.98]"
              >
                Shop all gear
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-900 px-8 py-3.5 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
              >
                Today's deals
              </Link>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 pt-2">
              <TrustPill icon={Truck}       label="Free shipping on orders $50+" />
              <TrustPill icon={ShieldCheck} label="2-year warranty included" />
            </div>
          </div>

          {/* Image side */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            {/* Decorative background blobs */}
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-stone-300/30 rounded-full blur-3xl -z-10" />

            <div className="relative rounded-3xl overflow-hidden aspect-4/3 bg-stone-100 shadow-2xl shadow-stone-900/10">
              <img
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200&auto=format&fit=crop"
                alt="Next-gen tech gear"
                className="w-full h-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">New collection</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">Summer 2026 drops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ─────────────────────────────────── */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-1">Just in</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                Latest drops
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors group"
            >
              View all
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : products.length === 0
                ? (
                  <div className="col-span-full text-center text-stone-400 py-20 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                    <p className="text-lg font-semibold text-stone-700">No products yet</p>
                    <p className="text-sm mt-1">Check back soon for new inventory.</p>
                  </div>
                )
                : products.map((product) => (
                  <Link
                    key={product.$id}
                    to={`/product/${product.$id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square bg-stone-50 overflow-hidden p-6 flex items-center justify-center">
                      <img
                        src={databaseService.getFileView(product.featuredImage)}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-108"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                        {product.category || 'Gear'}
                      </p>
                      <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors flex-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-stone-900">${product.price}</span>
                        <span className="text-xs font-semibold text-stone-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                          View <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
            }
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-stone-700">
              View full collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA band ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="bg-stone-900 rounded-3xl px-8 py-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ready to gear up?
            </h3>
            <p className="text-stone-400 mt-2">Browse the full catalogue and find your next upgrade.</p>
          </div>
          <Link
            to="/products"
            className="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-900 px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            Shop now <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
