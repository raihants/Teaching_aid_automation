import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import logo from '../assets/logopolman.svg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <img src={logo} alt="Polman Logo" className="h-20 mb-4" />
                        <h1 className="text-2xl font-bold text-primary">Teaching Aid Automation</h1>
                        <p className="text-on-surface-variant mt-2">Sign in to access control system</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                                <User size={16} /> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                                <Lock size={16} /> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="px-8 py-4 bg-surface-container text-center border-t border-outline-variant">
                    <p className="text-xs text-on-surface-variant">
                        Admin managed system. Contact your administrator for access.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
