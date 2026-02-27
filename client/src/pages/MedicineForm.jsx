import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPills, FaArrowLeft, FaCapsules, FaFlask, FaCalendarAlt, FaTag, FaBoxes, FaBookmark, FaSave } from 'react-icons/fa';

const MedicineForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        manufacturer: '',
        price: '',
        stock: '',
        expiryDate: '',
        description: '',
        supplier: 'Unknown'
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post('/api/medicines', formData, config);
            navigate('/medicines');
        } catch (error) {
            console.error('Error adding medicine:', error);
            const detail = error.response?.data?.detail || error.response?.data?.message || error.message;
            alert(`Failed to add medicine: ${detail}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
            {/* Atmospheric Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-16">
                    <button onClick={() => navigate('/medicines')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 hover:text-purple-400 transition-colors">
                        <FaArrowLeft /> Inventory Database
                    </button>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
                        Asset <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Initialisation</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Inject New Pharmaceutical Unit into Central Repository</p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <FaBookmark className="text-purple-500" /> Core Identification
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Chemical Designation</label>
                                    <div className="relative">
                                        <FaPills className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <input type="text" name="name" onChange={handleChange} placeholder="e.g. Paracetamol 500mg" className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-purple-500 transition-all font-bold" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Classification</label>
                                    <div className="relative">
                                        <FaTag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <select name="category" onChange={handleChange} className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-purple-500 transition-all font-bold appearance-none cursor-pointer" required>
                                            <option value="">Select Protocol</option>
                                            <option value="Analgesic/Antipyretic">Pain & Fever</option>
                                            <option value="Antidiabetic">Diabetes</option>
                                            <option value="Antihypertensive">Blood Pressure</option>
                                            <option value="Antacid">Gastric</option>
                                            <option value="Antibiotic">Antibiotics</option>
                                            <option value="Vitamin">Supplements</option>
                                            <option value="Other">Custom Class</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Synthesis Details / Description</label>
                                    <textarea name="description" rows="4" onChange={handleChange} placeholder="Enter pharmacological properties or usage guidelines..." className="w-full bg-black/40 border border-slate-800 rounded-[2rem] p-6 text-white outline-none focus:border-purple-500 transition-all font-medium"></textarea>
                                </div>
                            </div>
                        </section>

                        <section className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <FaFlask className="text-indigo-400" /> Supply Integrity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Stock Quantum (QTY)</label>
                                    <div className="relative">
                                        <FaBoxes className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <input type="number" name="stock" onChange={handleChange} className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-indigo-500 transition-all font-bold" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Market Val (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-600">₹</span>
                                        <input type="number" name="price" onChange={handleChange} className="w-full bg-black/40 border border-slate-800 rounded-3xl p-5 pl-14 text-white outline-none focus:border-indigo-500 transition-all font-bold" required />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Meta Info Side */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 p-10 rounded-[3rem] shadow-3xl">
                            <FaCalendarAlt className="text-white/20 text-4xl mb-6" />
                            <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2">Expiry Protocol</h4>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-tight mb-8">Set the decommissioning date for this asset node.</p>

                            <input type="date" name="expiryDate" onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-white font-black outline-none focus:bg-white/20 transition-all" required />
                        </div>

                        <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 border-dashed">
                            <FaCapsules className="text-slate-700 text-3xl mb-6" />
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Manufacturer</h4>
                            <input type="text" name="manufacturer" onChange={handleChange} placeholder="Source Entity" className="w-full bg-transparent border-b-2 border-slate-800 py-3 text-white font-bold outline-none focus:border-purple-500 transition-all" />
                        </div>

                        <button type="submit" className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-purple-500 hover:text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-95">
                            <FaSave /> Commit to Chain
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicineForm;
