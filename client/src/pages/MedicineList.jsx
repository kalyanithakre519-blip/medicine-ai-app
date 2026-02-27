import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaQrcode, FaTrash, FaSearch, FaPlus, FaTable, FaThLarge, FaWarehouse, FaTimes, FaPrint, FaCubes } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showQR, setShowQR] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const navigate = useNavigate();

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo?.token}` },
            };
            const { data } = await axios.get('/api/medicines', config);
            setMedicines(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                navigate('/login');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            fetchMedicines();
        }
    }, [navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('PERMANENT DELETION: Are you sure?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo?.token}` },
                };
                await axios.delete(`/api/medicines/${id}`, config);
                fetchMedicines();
            } catch (error) {
                console.error('Error deleting medicine:', error);
            }
        }
    };

    const filteredMedicines = medicines.filter(med =>
        (med.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (med.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const QRModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-[2000] p-4" onClick={() => setShowQR(null)}>
            <div className="bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] shadow-3xl flex flex-col items-center animate-in zoom-in duration-300 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <button onClick={() => setShowQR(null)} className="absolute right-8 top-8 text-slate-500 hover:text-white transition-all"><FaTimes /></button>

                <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">{showQR.name}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase mb-8 tracking-[0.3em]">Neural Asset ID: {showQR._id?.slice(-8).toUpperCase()}</p>

                <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl mb-8">
                    <QRCodeSVG
                        value={JSON.stringify({ id: showQR._id || showQR.id, name: showQR.name, price: showQR.price })}
                        size={200}
                        level={"H"}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
                        <FaPrint /> Print Tag
                    </button>
                    <button onClick={() => setShowQR(null)} className="bg-slate-800 border border-white/5 text-slate-400 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden relative">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {showQR && <QRModal />}

            {/* Header Section */}
            <header className="relative z-10 px-8 pt-12 pb-10 lg:px-16 bg-[#020617]/50 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1700px] mx-auto">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
                                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Security Terminal</Link>
                                <span className="opacity-30">/</span>
                                <span className="text-white">Inventory Repo</span>
                            </div>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                Medicine <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Repository</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-slate-900/50 border border-white/5 p-1 rounded-2xl flex">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-5 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    <FaTable /> Table
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-5 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    <FaThLarge /> Grid
                                </button>
                            </div>

                            <Link to="/add-medicine" className="bg-white hover:bg-purple-500 text-black hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3">
                                <FaPlus /> Register Asset
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-[1700px] mx-auto px-8 py-12 lg:px-16 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
                {/* Search Container */}
                <div className="relative mb-12 max-w-4xl group">
                    <div className="absolute inset-0 bg-indigo-600/20 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Query by name, category or batch code..."
                            className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-slate-900/50 border-2 border-slate-800 focus:border-purple-500 outline-none font-bold text-white transition-all placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-[6px] border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-8"></div>
                        <p className="font-black text-slate-600 uppercase text-[10px] tracking-[0.5em] animate-pulse">Syncing Neural Database...</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <div className="bg-slate-950/20 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 border-b border-white/5">
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Index</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Availability</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">valuation</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Safety Point</th>
                                            <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Terminal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredMedicines.map((med) => (
                                            <tr key={med._id || med.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-purple-400 font-black text-lg italic group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                                                            {med.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-white uppercase italic tracking-tighter text-base group-hover:text-purple-300 transition-colors">
                                                                {med.name}
                                                            </span>
                                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">
                                                                ID: {med._id?.slice(-10).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        {med.category}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className={`font-black text-lg italic tracking-tighter ${med.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                            {med.stock} <span className="text-[9px] text-slate-600 ml-1">UNITS</span>
                                                        </span>
                                                        <div className="w-24 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${med.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                                style={{ width: `${Math.min(100, (med.stock / 200) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="font-black text-lg text-white italic tracking-tighter">₹{med.price}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-400 tracking-tight">
                                                            {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'SECURED'}
                                                        </span>
                                                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Expiration Probe</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => setShowQR(med)}
                                                            className="w-10 h-10 bg-slate-800 border border-white/ client text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-400 rounded-xl flex items-center justify-center transition-all"
                                                            title="Asset QR"
                                                        >
                                                            <FaQrcode size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteHandler(med._id || med.id)}
                                                            className="w-10 h-10 bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:bg-rose-600 hover:border-rose-400 rounded-xl flex items-center justify-center transition-all"
                                                            title="Purge Record"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredMedicines.map((med) => (
                                    <div key={med._id || med.id} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3.5rem] border border-white/5 hover:border-purple-500/50 transition-all group shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-purple-500 transition-colors"></div>

                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-14 h-14 bg-slate-800 group-hover:bg-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic transition-all border border-white/5">
                                                {med.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowQR(med)} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><FaQrcode size={14} /></button>
                                                <button onClick={() => deleteHandler(med._id || med.id)} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all"><FaTrash size={14} /></button>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2 truncate" title={med.name}>{med.name}</h3>
                                        <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">{med.category}</span>

                                        <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
                                            <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Stock</p>
                                                <p className={`text-xl font-black italic tracking-tighter ${med.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{med.stock}</p>
                                            </div>
                                            <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Pricing</p>
                                                <p className="text-xl font-black italic tracking-tighter text-white">₹{med.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <FaWarehouse className="text-purple-500" /> BATCH: {med.batchNumber?.slice(-5).toUpperCase() || 'ROOT'}
                                            </div>
                                            <span className="text-slate-400">{med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredMedicines.length === 0 && (
                            <div className="py-40 text-center flex flex-col items-center">
                                <FaCubes size={60} className="text-slate-800 mb-8 opacity-50" />
                                <p className="font-black text-slate-700 uppercase text-xs tracking-[0.5em]">Inventory Segment Empty</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="fixed bottom-0 left-0 w-full bg-[#020617]/80 backdrop-blur-md px-10 py-4 border-t border-white/5 text-center pointer-events-none">
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-[1em]">Secure Asset Repository Management Protocol</span>
            </footer>
        </div>
    );
};

export default MedicineList;
