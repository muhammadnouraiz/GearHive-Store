/* src/pages/Signup.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import authService from '../services/auth';
import { Loader, AlertCircle } from 'lucide-react';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const create = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Create Account
            const session = await authService.createAccount(formData);
            
            if (session) {
                // 2. Get User Details
                const userData = await authService.getCurrentUser();
                if (userData) {
                    // 3. Update Redux & Redirect
                    dispatch(login(userData));
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.message);
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
                    <h2 className="text-xl font-bold text-slate-900">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Already have an account?&nbsp;
                        <Link
                            to="/login"
                            className="font-bold text-blue-700 hover:text-blue-800 transition-colors"
                        >
                            Sign In
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

                {/* Signup Form */}
                <form onSubmit={create} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                placeholder="Enter your full name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors bg-gray-50 focus:bg-white text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Create a password (min 8 chars)"
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
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;