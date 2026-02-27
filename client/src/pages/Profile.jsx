import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaShieldAlt, FaSave, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaIdCard, FaLock, FaUserSecret } from 'react-icons/fa';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');
            setRole(userInfo.role || '');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put('/api/users/profile', { name, email }, config);
            const updatedUserInfo = { ...userInfo, name: data.name, email: data.email };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setMessage({ text: 'Neural ID Synchronized', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);

        } catch (error) {
            console.error('Update Error:', error);
            const errorDetail = error.response?.data?.detail || 'Handshake Failure';
            setMessage({ text: errorDetail, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-600/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-16 flex justify-between items-center">
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 hover:text-white transition-colors">
                            <FaArrowLeft /> Dashboard
                        </button>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
                            Personnel <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Profile</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Security Clearance: {role.toUpperCase()}</p>
                    </div>
                    <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden relative group">
                        <img src={`https://i.pravatar.cc/150?u=${email}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="avatar" />
                        <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-5 gap-10 items-stretch">
                    {/* Left Stats/Status */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900/60 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full group-hover:scale-110 transition-transform"></div>
                            <FaShieldAlt className="text-indigo-500 text-3xl mb-6" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Authorized Status</h4>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 italic">Personnel data is currently encrypted and verified against local auth-nodes.</p>
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/10 p-3 rounded-2xl">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Sync Active</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/60 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <FaUserSecret className="text-purple-500 text-3xl mb-6" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Role Lock</h4>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed italic mb-4">Level {role === 'admin' ? '5' : '3'} Access. Protocol changes require central admin approval.</p>
                            <span className="inline-block px-4 py-1.5 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">ReadOnly-Role</span>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl h-full">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <FaIdCard className="text-purple-400" /> Identity Matrix
                            </h3>

                            {message.text && (
                                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                    {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                    <span className="text-xs font-black uppercase tracking-widest italic">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-purple-400">Public Protocol Name</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-purple-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-purple-400">Communication Node (Email)</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-purple-500 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-purple-500 hover:text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FaSave /> Synchronize ID
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-2 opacity-20">
                                <FaLock size={10} className="text-slate-500" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 italic">SHA-256 Identity Protection Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
