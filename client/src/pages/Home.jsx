import { FaArrowRight, FaMicrochip, FaShieldAlt, FaChartLine, FaRobot, FaBrain } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans">
            {/* Modular Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-bounce">
                        <FaMicrochip className="text-xs" /> Next-Gen AI Infrastructure
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 uppercase">
                        AI-Enabled <br />
                        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Management
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-400 text-lg md:text-xl font-bold max-w-3xl leading-relaxed mb-12 uppercase tracking-tight">
                        Experience the first modular pharmacy engine powered by <span className="text-white">Neural-Sync technology</span>.
                        Precision tracking, predictive restock, and autonomous patient care.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-24">
                        <Link to="/login" className="group px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl flex items-center gap-3 hover:bg-purple-500 hover:text-white transition-all shadow-2xl shadow-white/5">
                            Initialize Core <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <Link to="/register" className="px-12 py-5 bg-slate-900 border border-slate-800 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl flex items-center gap-3 hover:border-purple-500 transition-all">
                            Access Request
                        </Link>
                    </div>

                    {/* Modular Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                        {[
                            { icon: <FaBrain />, title: "Neural Prediction", desc: "98% accuracy in stock-out forecasting using LSTM models." },
                            { icon: <FaShieldAlt />, title: "Safe protocols", desc: "HIPAA compliant data encryption with automated audits." },
                            { icon: <FaChartLine />, title: "Live Analytics", desc: "Real-time enterprise dashboard with deep-link reporting." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] text-left hover:border-purple-500/50 transition-all group shadow-2xl">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all text-purple-400 text-2xl">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-2 text-white">{item.title}</h3>
                                <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Status Info */}
                    <div className="mt-24 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-3">
                            <FaRobot size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Autonomous Core</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Nodes Active: 1,248</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
