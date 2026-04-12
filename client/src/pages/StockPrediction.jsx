import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { FaBoxes, FaChartLine, FaRobot, FaExclamationTriangle, FaArrowLeft, FaBrain } from 'react-icons/fa';
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

const InventoryIntelligence = () => {
    const [data, setData] = useState({ top_item_graph: [], inventory_intelligence: [] });
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
                console.error("Error fetching EOQ data:", err);
                setError(err.response?.data?.error || "AI Engine Offline.");
                setLoading(false);
            }
        };
        fetchForecast();
    }, []);

    const chartData = {
        labels: data.top_item_graph.map(h => h.date),
        datasets: [
            {
                label: 'Projected Stock Level (Sawtooth)',
                data: data.top_item_graph.map(h => h.stockLevel),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                pointRadius: 1,
                fill: true,
                tension: 0.1,
            },
            {
                label: 'Reorder Point (Trigger)',
                data: data.top_item_graph.map(h => h.reorderLevel),
                borderColor: '#ef4444',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#94a3b8', font: { weight: 'bold' } } },
            title: { display: false },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b', font: { weight: 'bold' } },
                title: { display: true, text: 'Quantity Available', color: '#475569' }
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
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Running EOQ Matrix...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-8 font-sans pb-20">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700/50">
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">
                            Advanced EOQ & ABC Analysis
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Economic Order Quantity & Auto-Replenishment Matrix</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                        <FaRobot className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-emerald-400">Alg: {data.algorithm || 'JIT Engine'}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {error ? (
                    <div className="bg-slate-900/50 border border-red-500/20 rounded-[3rem] p-16 text-center backdrop-blur-xl">
                        <FaExclamationTriangle size={64} className="text-red-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">System Offline</h3>
                        <p className="text-slate-500 font-bold">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Top Graph Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                                <FaChartLine /> JIT Replenishment Simulation (Top VIP Item)
                            </h3>
                            <p className="text-[10px] text-slate-500 mb-6 max-w-xl">
                                This saw-tooth model demonstrates the optimal time to reorder an item to prevent stockouts while minimizing holding costs (Economic Order Quantity).
                            </p>
                            <div className="h-[300px]">
                                <Line options={options} data={chartData} />
                            </div>
                        </div>

                        {/* Inventory Matrix Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-slate-800 bg-black/20 flex items-center gap-3">
                                <FaBoxes className="text-indigo-400" />
                                <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">ABC Stratification & Reorder Engine</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-800/30 text-[10px] uppercase tracking-widest text-slate-500">
                                            <th className="p-4 font-black">Medicine</th>
                                            <th className="p-4 font-black">ABC Class</th>
                                            <th className="p-4 font-black">Velocity/Day</th>
                                            <th className="p-4 font-black">Reorder Pt</th>
                                            <th className="p-4 font-black text-emerald-400">EOQ (Order Qty)</th>
                                            <th className="p-4 font-black">Cur. Stock</th>
                                            <th className="p-4 font-black">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-800/50">
                                        {data.inventory_intelligence.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 font-bold text-white">{item.medicine}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${item.category.includes('A') ? 'bg-indigo-500/20 text-indigo-400' : item.category.includes('B') ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-400 font-mono">{item.daily_velocity} / d</td>
                                                <td className="p-4 text-amber-500 font-black">{item.reorder_point}</td>
                                                <td className="p-4 text-emerald-400 font-black text-lg">+{item.eoq}</td>
                                                <td className="p-4 text-slate-300 font-bold">{item.current_stock}</td>
                                                <td className="p-4">
                                                    {item.status === 'REORDER NOW' ? (
                                                        <span className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase bg-rose-500/10 px-3 py-1 rounded-full w-max">
                                                            <FaExclamationTriangle /> REORDER NOW
                                                        </span>
                                                    ) : item.status === 'OVERSTOCKED' ? (
                                                        <span className="text-amber-500 font-black text-xs uppercase bg-amber-500/10 px-3 py-1 rounded-full">
                                                            Excess Cap
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-500 font-black text-xs uppercase bg-emerald-500/10 px-3 py-1 rounded-full">
                                                            Healthy
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>
                )}
            </main>
        </div>
    );
};

export default InventoryIntelligence;
