import { Link, useNavigate } from 'react-router-dom';
import {
    FaHeartbeat, FaChartPie, FaSignOutAlt, FaShieldAlt, FaTerminal,
    FaThLarge, FaBoxes, FaMoneyBillWave, FaTruck, FaFileAlt,
    FaChartLine, FaExclamationTriangle, FaFileUpload, FaStethoscope,
    FaUserMd, FaUtensils, FaGem, FaBars
} from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const navLinks = [
        { to: "/dashboard", label: "Core", icon: <FaThLarge /> },
        { to: "/medicines", label: "Inventory", icon: <FaBoxes /> },
        { to: "/billing", label: "Billing", icon: <FaMoneyBillWave />, color: "text-purple-400" },
        { to: "/suppliers", label: "Links", icon: <FaTruck /> },
        { to: "/reports", label: "Audit", icon: <FaFileAlt /> },
        { to: "/predictions", label: "Forecast", icon: <FaChartLine /> },
        { to: "/expiry-risk", label: "Risk", icon: <FaExclamationTriangle />, color: "text-amber-500" },
        { to: "/smart-rx", label: "OCR AI", icon: <FaFileUpload /> },
        { to: "/ai-diagnosis", label: "Diagnosis", icon: <FaStethoscope />, color: "text-emerald-500" },
        { to: "/patient-care", label: "Patients", icon: <FaUserMd />, color: "text-pink-500" },
        { to: "/dietary-advisor", label: "Food AI", icon: <FaUtensils />, color: "text-orange-400" },
        { to: "/subscription", label: "Upgrade", icon: <FaGem />, color: "text-yellow-500", ping: true },
    ];

    return (
        <nav className="bg-[#020617]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-[1000] w-full shadow-2xl">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-8">
                        {/* Futuristic Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xl font-black italic shadow-lg shadow-purple-500/20 group-hover:rotate-[360deg] transition-all duration-700">
                                M
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white italic tracking-tighter leading-none group-hover:text-purple-400 transition-colors">MEDMANAGE</span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mt-1">Personnel OS v4</span>
                            </div>
                        </Link>

                        {/* Modular Navigation - Horizontal Scroll with Persistent Scrollbar */}
                        <div className="hidden lg:flex items-center gap-1 overflow-x-auto custom-navbar-scrollbar py-2 px-1">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.to}
                                    className={`nav-link-modular flex items-center gap-2 ${link.color || 'text-slate-400'}`}
                                >
                                    <span className="text-sm">{link.icon}</span>
                                    <span className="block">{link.label}</span>
                                    {link.ping && <span className="w-1 h-1 bg-yellow-500 rounded-full animate-ping"></span>}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-10 h-10 bg-slate-800/50 border border-white/5 text-white rounded-xl flex items-center justify-center">
                            <FaBars />
                        </button>

                        {/* Terminal Utilities */}
                        <div className="hidden lg:flex items-center gap-3 pr-6 border-r border-white/10">
                            <Link title="Global Analytics" to="/global-analytics" className="w-10 h-10 bg-slate-800/50 border border-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                <FaChartPie size={18} />
                            </Link>
                            <Link title="Security Protocol" to="/dashboard" className="w-10 h-10 bg-slate-800/50 border border-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all">
                                <FaShieldAlt size={18} />
                            </Link>
                        </div>

                        {userInfo ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-3 p-1.5 pr-4 bg-slate-800/40 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all group">
                                    <div className="w-9 h-9 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">
                                        {userInfo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[8px] font-black text-slate-500 uppercase leading-none tracking-widest">Authorized</p>
                                        <p className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-purple-400">{userInfo.name.split(' ')[0]}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    title="Terminate Session"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] tracking-[0.2em] shadow-2xl hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2">
                                <FaTerminal className="text-xs" /> INITIALIZE
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden bg-slate-900/95 backdrop-blur-3xl border-b border-white/10 p-6 grid grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 font-black uppercase text-[10px] tracking-widest ${link.color || 'text-white'}`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                    <Link to="/global-analytics" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 font-black uppercase text-[10px] tracking-widest text-indigo-400">
                        <FaChartPie /> Analytics
                    </Link>
                </div>
            )}

            <style jsx>{`
                .nav-link-modular {
                    padding: 0.6rem 0.8rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    border-radius: 0.75rem;
                    transition: all 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                    border: 1px solid transparent;
                }
                .nav-link-modular:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                    border-color: rgba(139, 92, 246, 0.3);
                    transform: translateY(-1px);
                }
                .custom-navbar-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-navbar-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-navbar-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.4);
                    border-radius: 10px;
                }
                .custom-navbar-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
