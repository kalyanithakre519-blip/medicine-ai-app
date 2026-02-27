import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaFingerprint, FaShieldAlt, FaArrowRight, FaStethoscope, FaLock, FaEnvelope } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('kalyanithakre519@gmail.com');
    const [password, setPassword] = useState('kalyani@123');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userInfo');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed';
            alert(`Authentication Error: ${errorMsg}`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative font-sans">
            {/* Modular Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="w-full max-w-[1100px] flex bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative z-10">
                {/* Left Side: Brand & Visuals */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl rotate-3">
                            <FaStethoscope className="text-indigo-600 text-3xl" />
                        </div>
                        <h1 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
                            MEDMANAGE <br /> <span className="text-indigo-200">AI CORE</span>
                        </h1>
                        <p className="text-indigo-100 text-lg font-medium opacity-80 uppercase tracking-widest">Advanced Pharmacy Intelligence</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                            <p className="text-white font-bold italic leading-relaxed">
                                "Our mission is to bridge the gap between AI automation and critical pharmacy patient care."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 border-2 border-white/20"></div>
                                <div>
                                    <p className="text-white text-xs font-black uppercase tracking-tighter">Dr. AI Vision</p>
                                    <p className="text-indigo-200 text-[10px] font-bold uppercase opacity-60">System Architect</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-500 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-widest flex items-center">Join 500+ Medical Stores</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-[450px] p-10 md:p-16 flex flex-col justify-center bg-slate-900">
                    <div className="mb-12">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 lg:hidden">
                            <FaStethoscope className="text-indigo-500 text-xl" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Initialize</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Access Secure Medical Terminal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-indigo-400 transition-colors">Credential ID</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                    <FaEnvelope />
                                </span>
                                <input
                                    type="email"
                                    className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl pl-14 pr-6 py-5 text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-800/80 transition-all text-sm"
                                    placeholder="email@medmanage.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-indigo-400 transition-colors">Access Key</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                    <FaLock />
                                </span>
                                <input
                                    type="password"
                                    className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl pl-14 pr-6 py-5 text-white font-bold outline-none focus:border-indigo-500 focus:bg-slate-800/80 transition-all text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="hidden" />
                                <div className="w-5 h-5 border-2 border-slate-700 rounded-lg flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-sm opacity-0 group-hover:opacity-100"></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Remember Terminal</span>
                            </label>
                            <a href="#" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Forgot Key?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-3xl font-black uppercase text-xs tracking-widest text-white shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Unlock System <FaArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-slate-800 flex-1"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Secure Protocols</span>
                            <div className="h-px bg-slate-800 flex-1"></div>
                        </div>

                        <button className="w-full border-2 border-slate-800 py-4 rounded-3xl flex items-center justify-center gap-4 hover:bg-slate-800 transition-all group">
                            <FaFingerprint className="text-slate-500 group-hover:text-indigo-400 transition-colors text-lg" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Biometric Secondary Auth</span>
                        </button>

                        <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Authorized Personnel Only. <Link to="/register" className="text-white hover:text-indigo-400 underline underline-offset-4 ml-2">Request Access</Link>
                        </p>
                    </div>

                    <div className="mt-auto pt-10 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <FaShieldAlt size={16} />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em]">HIPAA COMPLIANT STACK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
