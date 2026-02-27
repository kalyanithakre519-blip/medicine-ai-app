import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationTriangle, FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaArrowLeft, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpiryRisk = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRisks = async () => {
            try {
                const response = await axios.get('/api/stats/expiry-risk');
                setRisks(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching risks:", err);
                setLoading(false);
            }
        };
        fetchRisks();
    }, []);

    const getRiskStyles = (level) => {
        switch (level) {
            case 'EXPIRED': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
            case 'CRITICAL': return 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
            case 'HIGH': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
            default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Scanning Bio-Inventory...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-8 font-sans selection:bg-indigo-500">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700/50"
                        >
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent italic tracking-tighter">
                                Neural Expiry Tracker
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">AI-Powered Shelf Life & Risk Analysis</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-slate-900/50 border border-red-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-red-500/5 rotate-12 group-hover:scale-110 transition-transform"><FaExclamationTriangle size={80} /></div>
                        <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Expired Items</h3>
                        <p className="text-5xl font-black text-red-500 tracking-tighter">{risks.filter(r => r.riskLevel === 'EXPIRED').length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-orange-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-orange-500/5 rotate-12 group-hover:scale-110 transition-transform"><FaExclamationCircle size={80} /></div>
                        <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Critical Rush</h3>
                        <p className="text-5xl font-black text-orange-500 tracking-tighter">{risks.filter(r => r.riskLevel === 'CRITICAL').length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-yellow-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-yellow-500/5 rotate-12 group-hover:scale-110 transition-transform"><FaExclamationTriangle size={80} /></div>
                        <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">High Risk</h3>
                        <p className="text-5xl font-black text-yellow-500 tracking-tighter">{risks.filter(r => r.riskLevel === 'HIGH').length}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform"><FaShieldAlt size={80} /></div>
                        <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Healthy Stock</h3>
                        <p className="text-5xl font-black text-emerald-500 tracking-tighter">{risks.filter(r => r.riskLevel === 'LOW').length}</p>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-black italic uppercase tracking-tight">Full Inventory Audit</h2>
                        <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-4 py-1.5 rounded-full uppercase tracking-widest">Live Engine Feed</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/20">
                                    <th className="p-6">Medicine Identity</th>
                                    <th className="p-6">Exp. Signature</th>
                                    <th className="p-6 text-center">Neural Risk</th>
                                    <th className="p-6">AI Strategy</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {risks.map((risk, idx) => (
                                    <tr key={idx} className="group hover:bg-white/5 transition-all">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 font-black">
                                                    {risk.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-200 uppercase tracking-tight">{risk.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">Stock Remaining: {risk.stock}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <FaCalendarAlt className="text-slate-600" />
                                                <div>
                                                    <p className="text-sm font-black text-slate-300">{risk.expiryDate}</p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${risk.daysRemaining < 30 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>T-Minus {risk.daysRemaining} Days</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getRiskStyles(risk.riskLevel)}`}>
                                                {risk.riskLevel}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="p-4 bg-slate-800/40 border border-white/5 rounded-2xl">
                                                <p className="text-[11px] text-indigo-400 font-black italic tracking-tight">{risk.recommendation}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => navigate('/billing')}
                                                className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
                                            >
                                                <FaBoxOpen />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpiryRisk;
