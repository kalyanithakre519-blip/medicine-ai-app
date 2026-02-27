import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserClock, FaWhatsapp, FaArrowLeft, FaSync, FaPlus, FaTrash, FaTimes, FaRobot, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatientHealth = () => {
    const [refills, setRefills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        condition: '',
        medicine: '',
        lastBought: new Date().toISOString().split('T')[0],
        daysSupply: 30,
        fruitRecommendation: '',
        waterIntake: '',
        dietaryRestrictions: ''
    });

    const navigate = useNavigate();

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const fetchRefills = async () => {
        setLoading(true);
        setDebugInfo('Syncing with AI Engine...');
        try {
            const { data } = await axios.get('/api/predict-refills');
            if (Array.isArray(data) && data.length > 0) {
                setRefills(data);
                setDebugInfo(`Live: ${data.length} patients tracked`);
            } else {
                setRefills([]);
                setDebugInfo('No patients found in AI database');
            }
        } catch (error) {
            console.error("Fetch refills error:", error);
            setDebugInfo(`Sync Error: ${error.message}`);
            if (userInfo?.token) {
                try {
                    const { data } = await axios.get('/api/patients', {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    });
                    setRefills(data.map(p => ({
                        id: p._id || p.id,
                        name: p.name,
                        phone: p.phone,
                        medicine: p.medicine,
                        condition: p.condition,
                        status: 'STABLE',
                        exhausted_on: 'Pending AI Scan',
                        fruit: p.fruitRecommendation,
                        water: p.waterIntake,
                        avoid: p.dietaryRestrictions
                    })));
                } catch (err) { console.error("Fallback failed", err); }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchRefills();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addPatient = async (e) => {
        e.preventDefault();
        if (!userInfo?.token) return alert("Please login again");

        try {
            const payload = {
                ...formData,
                daysSupply: parseInt(formData.daysSupply) || 30
            };
            await axios.post('/api/patients', payload, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setShowModal(false);
            setFormData({
                name: '', phone: '', condition: '', medicine: '',
                lastBought: new Date().toISOString().split('T')[0],
                daysSupply: 30,
                fruitRecommendation: '',
                waterIntake: '',
                dietaryRestrictions: ''
            });
            alert("Patient Registered Successfully!");
            fetchRefills();
        } catch (error) {
            console.error("Add patient error:", error);
            alert("Registration Failed: " + (error.response?.data?.detail || error.message));
        }
    };

    const deletePatient = async (id) => {
        if (!id || id.includes('demo')) {
            alert("Demo patients cannot be deleted.");
            return;
        }
        if (!window.confirm("ARE YOU SURE?")) return;

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/patients/${id}`, config);
            fetchRefills();
        } catch (error) {
            alert("Delete Failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate('/dashboard')} className="p-4 bg-slate-900 rounded-3xl border border-slate-800 hover:bg-slate-800 transition-all">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent uppercase">
                                Chronic Terminal
                            </h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                {debugInfo}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={fetchRefills} className="p-4 bg-slate-900 rounded-3xl border border-slate-800" title="Refresh AI Stats">
                            <FaSync className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setShowModal(true)} className="px-10 py-4 bg-indigo-600 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-indigo-600/30">
                            + Add Patient
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {refills.map((p, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-10 relative group hover:border-pink-500/50 transition-all shadow-xl overflow-hidden">
                            {!p.id?.includes('demo') && (
                                <button onClick={() => deletePatient(p.id)} className="absolute bottom-6 right-6 w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-20">
                                    <FaTrash size={18} />
                                </button>
                            )}

                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl rounded-tr-[3rem] text-[10px] font-black uppercase tracking-widest ${p.status === 'OVERDUE' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                {p.status}
                            </div>

                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-600 transition-colors">
                                <FaUserClock size={28} className="text-indigo-400 group-hover:text-white" />
                            </div>

                            <h3 className="text-3xl font-black italic tracking-tighter text-white mb-2 uppercase break-words">{p.name}</h3>
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">{p.condition}</p>

                            {/* Prominent AI Recommendation Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural AI Analysis</span>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            <div className="bg-black/30 rounded-3xl p-6 mb-4 border border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Prescribed Medicine</p>
                                <p className="text-lg font-bold text-white/90 italic tracking-tight">💊 {p.medicine}</p>
                            </div>

                            {/* Lifestyle recommendations - FIXED VISIBILITY */}
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-[2.5rem] p-6 mb-8 border border-white/10 shadow-inner">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 text-center">--- AI FOOD & DIET SYSTEM ---</p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 text-base">🍎</div>
                                        <div className="flex flex-col">
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Best Fruits</p>
                                            <p className="text-[11px] font-bold text-white uppercase">{p.fruit || "Seasonal fruits"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-base">💧</div>
                                        <div className="flex flex-col">
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Water Intake</p>
                                            <p className="text-[11px] font-bold text-white uppercase">{p.water || "3-4 Liters/Day"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group-hover:bg-rose-500/10 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500 text-base">🚫</div>
                                        <div className="flex flex-col">
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Forbidden (Not to eat)</p>
                                            <p className="text-[11px] font-bold text-rose-400 uppercase">{p.avoid || "No Oily/High Salt"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase text-slate-500 mb-8 px-2">
                                <div>
                                    <p className="text-slate-600 mb-1">Ends on</p>
                                    <p className="text-white bg-slate-800 px-3 py-1 rounded-lg inline-block whitespace-nowrap">{p.exhausted_on}</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-1">Stock</p>
                                    <p className="text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-lg inline-block">{p.days_supply || 30} Days</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const msg = `*HEALTH ALERT* Dear ${p.name}, supply for ${p.medicine} is low. Recommended: Eat ${p.fruit || "fruits"}, Drink ${p.water || "water"}, and ${p.avoid || "avoid restrictions"}.`;
                                    window.open(`https://api.whatsapp.com/send?phone=91${p.phone}&text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 transition-all"
                            >
                                <FaWhatsapp size={20} /> Send Alert
                            </button>
                        </div>
                    ))}
                </div>

                {refills.length === 0 && !loading && (
                    <div className="py-40 text-center">
                        <FaRobot size={60} className="mx-auto text-slate-800 mb-8" />
                        <h2 className="text-2xl font-black text-slate-600 uppercase tracking-widest">No Patients</h2>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/70">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[4rem] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                        <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-slate-500 hover:text-white"><FaTimes /></button>
                        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter text-center mb-10">Register Case</h2>
                        <form onSubmit={addPatient} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <input required name="name" value={formData.name} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Name" />
                                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Phone" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required name="condition" value={formData.condition} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Condition" />
                                <input required name="medicine" value={formData.medicine} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Medicine" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="date" name="lastBought" value={formData.lastBought} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs" />
                                <input required type="number" name="daysSupply" value={formData.daysSupply} onChange={handleInputChange} className="bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Days Supply" />
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Diet & Lifestyle Data</p>
                                <input name="fruitRecommendation" value={formData.fruitRecommendation} onChange={handleInputChange} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Fruit Recommendations (e.g. Apple, Guava)" />
                                <input name="waterIntake" value={formData.waterIntake} onChange={handleInputChange} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold" placeholder="Daily Water Goal (e.g. 4 Liters)" />
                                <input name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleInputChange} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none text-xs font-bold placeholder:text-rose-400/50" placeholder="Forbidden Foods (e.g. No Extra Salt)" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 py-6 rounded-3xl font-black uppercase text-xs tracking-widest mt-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                                Initialize AI Tracking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientHealth;
