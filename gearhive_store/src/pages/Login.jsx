/* src/pages/Login.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';
import authService from '../services/auth';
import { Loader, AlertCircle } from 'lucide-react'; // Added icons

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const session = await authService.login(formData);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white font-sans py-12 px-4">
            
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-slate-200/50">
                
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Gear<span className="text-blue-700">Hive</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Don&apos;t have an account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-bold text-blue-700 hover:text-blue-800 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100 text-red-600 text-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                placeholder="Enter your email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-gray-50 focus:bg-white text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-semibold text-blue-700 hover:text-blue-800">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-gray-50 focus:bg-white text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;