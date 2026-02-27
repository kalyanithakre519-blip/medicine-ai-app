import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { FaGlobe, FaArrowUp, FaStore, FaChartLine, FaArrowLeft, FaSync, FaMicrochip, FaDatabase, FaSatellite } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GlobalAnalytics = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/stats/multi-store');
                setStats(data);
            } catch (error) { console.error(error); }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: stats.map(s => s.store),
        datasets: [{
            label: 'Sales Revenue (INR)',
            data: stats.map(s => s.sales),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            borderRadius: 20,
            hoverBackgroundColor: 'rgba(139, 92, 246, 0.8)',
        }]
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
            {/* Orbital Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 hover:text-indigo-400 transition-colors">
                            <FaArrowLeft /> Dashboard
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/20 text-indigo-400">
                                <FaGlobe size={24} className="animate-pulse" />
                            </div>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                Enterprise <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Nexus</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-3">
                            <FaSatellite /> Cross-Store Neural Telemetry System
                        </p>
                    </div>

                    <button onClick={() => window.location.reload()} className="p-5 bg-slate-900/50 border border-white/5 rounded-3xl text-indigo-400 hover:bg-slate-800 transition-all">
                        <FaSync className={loading ? 'animate-spin' : ''} />
                    </button>
                </header>

                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center">
                        <FaMicrochip size={48} className="text-indigo-500 mb-6 animate-spin" />
                        <p className="font-black text-slate-600 uppercase tracking-[0.5em] text-[10px]">Filtering Global Packets...</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Stats Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((s, idx) => (
                                <div key={idx} className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[3rem] shadow-2xl group hover:border-indigo-500/50 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-400">
                                            <FaStore />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-emerald-500 font-black text-[10px] flex items-center gap-1 uppercase tracking-widest italic">
                                                <FaArrowUp size={8} /> 12.4%
                                            </span>
                                            <p className="text-[8px] font-black text-slate-600 uppercase mt-1">Growth</p>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-white italic uppercase text-xs tracking-[0.2em] mb-1">{s.store}</h3>
                                    <p className="text-3xl font-black tracking-tighter text-white">₹{(s.sales / 1000).toFixed(1)}k</p>

                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Inventory Health</span>
                                            <span className="text-[10px] font-black text-indigo-400 italic">{s.stock_health}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000" style={{ width: `${s.stock_health}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Visual Analytics Hub */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl"></div>
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                    <FaChartLine className="text-indigo-400" /> Revenue Flow Comparative
                                </h2>
                                <div className="h-[350px]">
                                    <Bar
                                        data={chartData}
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: { color: 'rgba(255,255,255,0.03)' },
                                                    ticks: { color: '#64748b', font: { weight: '800', size: 10 } }
                                                },
                                                x: {
                                                    grid: { display: false },
                                                    ticks: { color: '#94a3b8', font: { weight: '800', size: 10 } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-700 to-purple-900 p-10 rounded-[3.5rem] shadow-3xl text-white relative overflow-hidden group">
                                <FaMicrochip size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Neural Strategy</h2>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-tight mb-10 italic">AI-Generated Cluster Insights</p>

                                <div className="space-y-6 relative z-10">
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">Priority Segment</p>
                                        <p className="text-3xl font-black italic tracking-tighter">Antibiotics</p>
                                        <p className="text-[9px] font-bold text-white/50 mt-2 uppercase tracking-tight">Noida Node requires 40% bandwidth increase.</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-3">Efficiency Leader</p>
                                        <p className="text-3xl font-black italic tracking-tighter">Delhi Hub</p>
                                        <p className="text-[9px] font-bold text-white/50 mt-2 uppercase tracking-tight">98% Deployment Precision Reached.</p>
                                    </div>
                                    <button className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-[2rem] hover:bg-indigo-400 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 mt-4">
                                        <FaDatabase /> Full Cluster Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="mt-20 text-center opacity-20 flex flex-col items-center gap-4 py-8">
                    <div className="h-px w-32 bg-white/20"></div>
                    <span className="text-[8px] font-black uppercase tracking-[1em] italic text-slate-500">Secure Enterprise Telemetry Protocol v9.0.4</span>
                </footer>
            </div>
        </div>
    );
};

export default GlobalAnalytics;
