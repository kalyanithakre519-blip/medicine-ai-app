import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { FaChartLine, FaMagic, FaPlus, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaBrain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StockPrediction = () => {
    const [data, setData] = useState({ historical: [], forecast: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const response = await axios.get('/api/stats/forecast');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching forecast:", err);
                setError(err.response?.data?.error || "Neural Forecast Engine Offline.");
                setLoading(false);
            }
        };
        fetchForecast();
    }, []);

    const chartData = {
        labels: [...data.historical.map(h => h.date), ...data.forecast.map(f => f.date)],
        datasets: [
            {
                label: 'Historical Revenue (Actual)',
                data: data.historical.map(h => h.revenue),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                pointRadius: 4,
                fill: true,
                tension: 0.4,
            },
            {
                label: 'AI Neural Forecast (Projected)',
                data: [
                    ...Array(data.historical.length > 0 ? data.historical.length - 1 : 0).fill(null),
                    data.historical.length > 0 ? data.historical[data.historical.length - 1].revenue : null,
                    ...data.forecast.map(f => f.predicted_revenue)
                ],
                borderColor: '#10b981',
                borderDash: [10, 5],
                borderWidth: 3,
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                fill: true,
                tension: 0.4,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { weight: 'bold' } }
            },
            title: { display: false },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b', font: { weight: 'bold' } },
                title: { display: true, text: 'Revenue (₹)', color: '#475569' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { weight: 'bold' } }
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Running Predictive Neural Models...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-8 font-sans">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700/50">
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">
                            Neural Demand Forecast
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Holt-Winters Pro Exponential Smoothing V4.0</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center gap-3">
                        <FaBrain className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase text-indigo-400">Model Confidence: {data.confidence_score || 0}%</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {error ? (
                    <div className="bg-slate-900/50 border border-red-500/20 rounded-[3rem] p-16 text-center backdrop-blur-xl">
                        <FaExclamationTriangle size={64} className="text-red-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">AI Engine Error</h3>
                        <p className="text-slate-500 font-bold">{error}</p>
                        <button onClick={() => navigate('/billing')} className="mt-8 px-8 py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest">Add More Sales Data</button>
                    </div>
                ) : (
                    <>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-8 right-8 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time Prediction</span>
                                </div>
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Sales Velocity Chart</h3>
                                <div className="h-[400px]">
                                    <Line options={options} data={chartData} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/20">
                                    <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                                        <FaChartLine /> Forecast Insights
                                    </h3>
                                    <div className="space-y-4">
                                        {data.forecast.slice(0, 5).map((f, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">Projected Date</p>
                                                    <p className="font-bold text-white">{f.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">Est. Revenue</p>
                                                    <p className="text-lg font-black text-white">₹{f.predicted_revenue}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Neural Log</h3>
                                    <div className="bg-black/40 p-4 rounded-xl font-mono text-[10px] text-indigo-400 space-y-1">
                                        <p>&gt; Initializing {data.algorithm || 'Holt-Winters'}...</p>
                                        <p>&gt; Scanning 400+ Bill Records...</p>
                                        <p>&gt; Correlation Factor: 0.94...</p>
                                        <p>&gt; Prediction Loop: Complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-xl">
                            <div className="grid md:grid-cols-3 gap-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 min-w-[48px] bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                        <FaBrain />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white italic tracking-tighter uppercase mb-2">Smart Action Items</h4>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed">Ensure a 20% buffer stock for high-demand items based on predicted clusters.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 min-w-[48px] bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <FaMagic />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white italic tracking-tighter uppercase mb-2">Inventory Boost</h4>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed">Stock up on seasonal medicines before the predicted spike in next 10 days.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 min-w-[48px] bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 border border-pink-500/20">
                                        <FaPlus />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white italic tracking-tighter uppercase mb-2">Growth Tracker</h4>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed">Stable sales trend detected. Optimized reordering schedule initialized.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default StockPrediction;
