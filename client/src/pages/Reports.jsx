import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Filler
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaArrowLeft, FaSync, FaWallet, FaShoppingCart, FaDna, FaMicrochip, FaCubes } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Filler
);

const Reports = () => {
    const [salesData, setSalesData] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const fetchReports = async () => {
        setRefreshing(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const salesRes = await axios.get('/api/stats/sales', config);
            const productsRes = await axios.get('/api/stats/top-products', config);

            setSalesData(salesRes.data);
            setTopProducts(productsRes.data);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            fetchReports();
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                <p className="text-purple-400 font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">Decrypting Sales Matrix...</p>
            </div>
        );
    }

    if (!salesData || !topProducts) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20">
                    <FaMicrochip size={40} />
                </div>
                <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">AI Link Disconnected</h1>
                <p className="text-slate-500 max-w-md font-bold text-sm leading-relaxed mb-10">
                    The Python AI Service (Port 5001) is currently unreachable. Ensure the neural engine is active to visualize sales analytics.
                </p>
                <button onClick={fetchReports} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl">
                    Reconnect Pulse
                </button>
            </div>
        );
    }

    // Chart Configs
    const trends = salesData.sales_trend || [];
    const trendLabels = trends.map(t => t.date);
    const trendValues = trends.map(t => t.revenue);

    const lineData = {
        labels: trendLabels,
        datasets: [
            {
                label: 'Revenue Flow',
                data: trendValues,
                fill: true,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#a855f7',
                pointHoverRadius: 6,
                tension: 0.4,
            },
        ],
    };

    const productLabels = topProducts.map(p => p._id);
    const productQuantities = topProducts.map(p => p.total_quantity);

    const doughnutData = {
        labels: productLabels,
        datasets: [
            {
                label: '# Units',
                data: productQuantities,
                backgroundColor: [
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                ],
                borderColor: '#0f172a',
                borderWidth: 4,
                hoverOffset: 20
            },
        ],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { family: 'Inter', size: 14, weight: 'bold' },
                padding: 15,
                cornerRadius: 12,
                displayColors: false
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-[1700px] mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
                            <button onClick={() => navigate('/dashboard')} className="hover:text-purple-400 transition-colors flex items-center gap-2 uppercase">
                                <FaArrowLeft /> Dashboard
                            </button>
                            <span className="opacity-30">/</span>
                            <span className="text-white">Neural Analytics</span>
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                            Sales <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Intelligence</span>
                        </h1>
                    </div>

                    <button
                        onClick={fetchReports}
                        className={`w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-xl ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <FaSync size={24} />
                    </button>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl group hover:border-purple-500/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                            <FaWallet size={80} />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Revenue</h3>
                        <p className="text-5xl font-black text-white italic tracking-tighter mb-2">₹{salesData.total_revenue.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Synchronized
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                            <FaShoppingCart size={80} />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Order Volatility</h3>
                        <p className="text-5xl font-black text-white italic tracking-tighter mb-2">{salesData.total_orders}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Processed Segments</p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 shadow-2xl group hover:border-pink-500/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-pink-500/10 group-hover:text-pink-500/20 transition-colors">
                            <FaChartLine size={80} />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Order valuation</h3>
                        <p className="text-5xl font-black text-white italic tracking-tighter mb-2">₹{salesData.average_order_value.toFixed(2)}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Average per terminal</p>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden group">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                                <FaChartLine className="text-purple-500" /> Revenue <span className="text-slate-500 font-bold">Velocity</span>
                            </h3>
                            <span className="text-[8px] font-black bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-purple-500/20">30-Day Pulse</span>
                        </div>
                        <div className="h-[350px]">
                            <Line data={lineData} options={commonOptions} />
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl group">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                                <FaDna className="text-indigo-500" /> Inventory <span className="text-slate-500 font-bold">Alpha</span>
                            </h3>
                            <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-indigo-500/20">Top Deployments</span>
                        </div>
                        <div className="flex flex-col xl:flex-row items-center gap-10">
                            <div className="w-full xl:w-1/2 h-[300px]">
                                <Doughnut data={doughnutData} options={{ ...commonOptions, scales: { x: { display: false }, y: { display: false } } }} />
                            </div>
                            <div className="w-full xl:w-1/2 space-y-4">
                                {topProducts.slice(0, 4).map((p, idx) => (
                                    <div key={idx} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex justify-between items-center backdrop-blur-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">{p._id}</span>
                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Growth Matrix</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-indigo-400">{p.total_quantity} Unit</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Analytics Table */}
                <div className="bg-slate-950/20 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-sm relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    <div className="px-10 py-8 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                            <FaCubes className="text-slate-500" /> Deep <span className="text-slate-500 font-bold">Metrics</span>
                        </h3>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Asset Performance Log</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-slate-500 uppercase text-[9px] font-black tracking-widest">
                                <tr>
                                    <th className="px-10 py-6">Asset signature</th>
                                    <th className="px-10 py-6">Deployment Vol</th>
                                    <th className="px-10 py-6 text-right">Revenue Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {topProducts.map((product, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-purple-400 font-black italic text-sm border border-white/5 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                    {product._id.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-black text-white uppercase italic tracking-tighter group-hover:text-purple-300 transition-colors">{product._id}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 transition-all duration-1000"
                                                        style={{ width: `${Math.min(100, (product.total_quantity / 100) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400">{product.total_quantity} U</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <span className="text-base font-black text-white italic tracking-tighter group-hover:text-indigo-400 transition-colors">₹{product.total_revenue.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="mt-16 text-center">
                    <p className="text-[8px] font-black text-slate-800 uppercase tracking-[1em] mb-4">AI-Driven Financial Intelligence Matrix</p>
                    <div className="w-24 h-px bg-white/5 mx-auto"></div>
                </footer>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Reports;
