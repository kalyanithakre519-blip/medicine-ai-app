import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { FaBoxes, FaMoneyBillWave, FaExclamationTriangle, FaCalendarAlt, FaRobot, FaMagic, FaChartLine, FaArrowRight, FaDownload, FaUtensils, FaGem } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStock: 0,
        totalValue: 0,
        lowStock: 0,
        expiringSoon: 0
    });
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchData = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    const { data } = await axios.get('/api/medicines', config);
                    setMedicines(data);

                    const now = new Date();
                    const nextMonth = new Date();
                    nextMonth.setMonth(now.getMonth() + 3);

                    const totalStock = data.reduce((acc, med) => acc + med.stock, 0);
                    const totalValue = data.reduce((acc, med) => acc + (med.stock * med.price), 0);
                    const lowStock = data.filter(med => med.stock < 10).length;
                    const expiringSoon = data.filter(med => {
                        const expDate = new Date(med.expiryDate);
                        return expDate <= nextMonth && expDate >= now;
                    }).length;

                    setStats({ totalStock, totalValue, lowStock, expiringSoon });
                    setLoading(false);
                } catch (error) {
                    console.error('Dashboard Data Error:', error);
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [navigate, userInfo?.token]);

    const lowStockItems = useMemo(() => medicines.filter(m => m.stock < 10), [medicines]);

    const generateAutoPO = async () => {
        if (lowStockItems.length === 0) return alert("Inventory Healthy");
        try {
            const response = await axios.post('/api/generate-po',
                { items: lowStockItems.map(m => ({ name: m.name, stock: m.stock })) },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `PO_AI_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) { alert("AI PO Failed"); }
    };

    const barData = {
        labels: medicines.slice(0, 5).map(m => m.name),
        datasets: [{
            label: 'Stock Level',
            data: medicines.slice(0, 5).map(m => m.stock),
            backgroundColor: '#8b5cf6',
            hoverBackgroundColor: '#a78bfa',
            borderRadius: 12,
        }]
    };

    const categories = [...new Set(medicines.map(m => m.category))];
    const pieData = {
        labels: categories,
        datasets: [{
            data: categories.map(cat => medicines.filter(m => m.category === cat).length),
            backgroundColor: ['#c084fc', '#818cf8', '#f472b6', '#fb7185', '#fbbf24'],
            borderWidth: 0,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <p className="text-purple-400 font-black uppercase text-xs tracking-widest animate-pulse">Initializing Terminal...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-10 font-sans">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
                        Admin <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Terminal</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        Welcome back, <span className="text-white">{userInfo?.name}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">AI Service: Active</span>
                    </div>
                </div>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: "Total Stock", val: stats.totalStock, icon: <FaBoxes />, color: "border-purple-500/50", text: "text-purple-400" },
                    { label: "Inventory Value", val: `₹${stats.totalValue.toLocaleString()}`, icon: <FaMoneyBillWave />, color: "border-indigo-500/50", text: "text-indigo-400" },
                    { label: "Low Stock Alerts", val: stats.lowStock, icon: <FaExclamationTriangle />, color: "border-rose-500/50", text: "text-rose-500" },
                    { label: "Expiring (3M)", val: stats.expiringSoon, icon: <FaCalendarAlt />, color: "border-amber-500/50", text: "text-amber-500" }
                ].map((stat, i) => (
                    <div key={i} className={`bg-slate-900/40 backdrop-blur-xl border-t-4 ${stat.color} rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all group`}>
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <div className={`text-xl ${stat.text} opacity-20 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
                        </div>
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{stat.val}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <FaChartLine className="text-purple-500" /> Inventory Levels
                        </h3>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Top 5</span>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter mb-10 text-center">Department Split</h3>
                    <div className="flex flex-col items-center">
                        <div className="w-56 h-56 mb-8">
                            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {categories.slice(0, 4).map((cat, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pieData.datasets[0].backgroundColor[i] }}></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">{cat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Action Strip */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-800 rounded-[3rem] p-12 shadow-3xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all"></div>

                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
                    <div className="max-w-2xl text-center xl:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <FaRobot /> AI Intelligence Layer
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">Elevate Pharmacy Operations</h2>
                        <p className="text-indigo-100/70 font-bold uppercase text-xs tracking-tight">Deploying neural models for demand forecasting, interaction screening, and patient adherence loop.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full xl:w-auto">
                        <button onClick={generateAutoPO} className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 p-6 rounded-3xl transition-all">
                            <FaDownload className="text-xl" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Auto-PO</span>
                        </button>
                        <button onClick={() => navigate('/predictions')} className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 p-6 rounded-3xl transition-all">
                            <FaMagic className="text-xl" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Forecasting</span>
                        </button>
                        <button onClick={() => navigate('/dietary-advisor')} className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 p-6 rounded-3xl transition-all">
                            <FaUtensils className="text-xl" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Food AI</span>
                        </button>
                        <button onClick={() => navigate('/patient-care')} className="flex flex-col items-center justify-center gap-3 bg-white text-black p-6 rounded-3xl transition-all hover:scale-105">
                            <FaArrowRight className="text-xl" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Terminal</span>
                        </button>
                        <button onClick={() => navigate('/subscription')} className="flex flex-col items-center justify-center gap-3 bg-yellow-400 text-black p-6 rounded-3xl transition-all hover:scale-105">
                            <FaGem className="text-xl" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Upgrade</span>
                        </button>
                        {deferredPrompt && (
                            <button onClick={handleInstallClick} className="flex flex-col items-center justify-center gap-3 bg-yellow-400 text-black p-6 rounded-3xl transition-all animate-bounce">
                                <FaDownload className="text-xl" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Install App</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-center opacity-20 hover:opacity-100 transition-all">
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">System Core v4.2.0 • Deployment ID: RX-9901</p>
            </footer>
        </div>
    );
};

export default Dashboard;
