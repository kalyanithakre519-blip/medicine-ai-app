import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaArrowRight, FaDna, FaShieldVirus, FaUserShield, FaIdBadge, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('pharmacist');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('userInfo');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/register', { name, email, password, role }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            let errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Registration failed';
            alert(`Access Request Denied: ${errorMsg}`);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden relative font-sans">
            {/* Background Glows */}
            <div className="absolute top-[20%] left-[-15%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[-15%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>

            <div className="w-full max-w-[1100px] flex bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative z-10 flex-row-reverse">
                {/* Visual Side */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-purple-700 via-indigo-700 to-indigo-600 p-16 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 20" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20">
                            <FaDna className="text-white text-3xl animate-bounce" />
                        </div>
                        <h1 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-4">
                            SYSTEM <br /> <span className="text-purple-200 text-5xl">ONBOARDING</span>
                        </h1>
                        <p className="text-indigo-100 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Join the AI Health Infrastructure</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                <FaShieldVirus className="text-purple-300 text-2xl mb-3" />
                                <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Encrypted</h4>
                                <p className="text-indigo-100/60 text-[9px] font-bold">End-to-end data security with blockchain logging.</p>
                            </div>
                            <div className="p-5 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                <FaUserShield className="text-indigo-300 text-2xl mb-3" />
                                <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">KYC Ready</h4>
                                <p className="text-indigo-100/60 text-[9px] font-bold">Standard pharmacy compliance protocols.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                            <div className="flex -space-x-2">
                                {[6, 7, 8].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-700 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-indigo-200 text-[9px] font-black uppercase tracking-widest">Deploying 14 New Nodes Today</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-[450px] p-10 md:p-14 flex flex-col justify-center bg-slate-900">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Request Access</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Generate New Personnel ID</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1 group">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors">Personnel Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" />
                                <input required className="w-full bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-1 group">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors">Digital Mailbox</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" />
                                <input required type="email" className="w-full bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors">Credential</label>
                                <div className="relative">
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" />
                                    <input required type="password" className="w-full bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm" placeholder="Secret Key" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors">Auth Role</label>
                                <div className="relative">
                                    <FaIdBadge className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" />
                                    <select className="w-full bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-purple-500 transition-all text-sm appearance-none" value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white shadow-2xl shadow-purple-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Generate Personnel ID <FaArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Existing Personnel? <Link to="/login" className="text-white hover:text-purple-400 underline underline-offset-4 ml-1">Access Terminal</Link>
                        </p>
                    </div>

                    <div className="mt-auto pt-8 flex items-center justify-center gap-2 opacity-20 hover:opacity-100 transition-all grayscale hover:grayscale-0">
                        <FaUserPlus size={12} className="text-purple-400" />
                        <span className="text-[7px] font-black uppercase tracking-[0.3em]">Authorized Deployment Protocol v4.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
