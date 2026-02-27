import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    FaWarehouse, FaPlus, FaTrash, FaEnvelope, FaPhone,
    FaMapMarkerAlt, FaUserTie, FaArrowLeft, FaSync, FaTimes,
    FaWhatsapp, FaShareSquare, FaExclamationTriangle
} from 'react-icons/fa';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate();

    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const [supRes, medRes] = await Promise.all([
                axios.get('/api/suppliers', config),
                axios.get('/api/medicines', config)
            ]);
            setSuppliers(supRes.data);
            setOutOfStock(medRes.data.filter(m => m.stock <= 0));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [navigate]);

    const handleWhatsApp = (supplier) => {
        if (outOfStock.length === 0) return alert("All Inventory Nodes Operational. No items out of stock.");
        const medList = outOfStock.map(m => `• ${m.name}`).join('%0A');
        const message = `*URGENT STOCK REQUEST*%0A%0AHello ${supplier.name},%0A%0AThe following medicine nodes have reached zero capacity in our inventory:%0A%0A${medList}%0A%0APlease process a restock deployment immediately.%0A%0A_Sent via MedManage AI Terminal_`;
        const phone = supplier.phone.replace(/[^0-9]/g, '');
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');
    };

    const handleEmail = (supplier) => {
        if (outOfStock.length === 0) return alert("Inventory Healthy. No restock needed.");
        const medList = outOfStock.map(m => `- ${m.name}`).join('\n');
        const subject = `URGENT: Inventory Depletion Notice - ${outOfStock.length} Items`;
        const body = `Hello ${supplier.name},\n\nThe following items are currently OUT OF STOCK in our system:\n\n${medList}\n\nPlease send us a quotation for these items at your earliest convenience.\n\nRegards,\nPharmacy Inventory Management`;
        window.location.href = `mailto:${supplier.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

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
            await axios.post('/api/suppliers', formData, config);
            setShowModal(false);
            setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add supplier. Root Protocol Denied.');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('TERMINATE SUPPLIER NODE?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/suppliers/${id}`, config);
                fetchData();
            } catch (error) {
                console.error(error);
                alert('Deletion Failed. Persistence Protocol Active.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate('/dashboard')} className="p-4 bg-slate-900 rounded-3xl border border-white/5 hover:bg-slate-800 transition-all text-slate-400">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                Supplier <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Repository</span>
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></span>
                                    {suppliers.length} Linked Nodes
                                </p>
                                {outOfStock.length > 0 && (
                                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">
                                        {outOfStock.length} Dead Assets Detected
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={fetchData} className="p-4 bg-slate-900 rounded-3xl border border-white/5 text-blue-400">
                            <FaSync className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setShowModal(true)} className="px-10 py-4 bg-blue-600 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-600/30">
                            + Initialise Node
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {suppliers.map((supplier) => (
                        <div key={supplier._id} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 relative group hover:border-blue-500/50 transition-all shadow-2xl overflow-hidden">
                            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-blue-600/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <FaWarehouse size={24} className="text-blue-400 group-hover:text-white" />
                                </div>
                                {outOfStock.length > 0 && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl" title="Stock Depletion Alert">
                                        <FaExclamationTriangle size={14} className="animate-bounce" />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-black italic tracking-tighter text-white mb-2 uppercase truncate">{supplier.name}</h3>
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                <FaUserTie size={10} /> {supplier.contactPerson || "Anonymous Handler"}
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-slate-400 text-xs font-medium bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <FaEnvelope className="text-blue-500/50" />
                                    <span className="truncate">{supplier.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 text-xs font-medium bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <FaPhone className="text-blue-500/50" />
                                    <span>{supplier.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    onClick={() => handleWhatsApp(supplier)}
                                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    <FaWhatsapp size={16} /> WhatsApp
                                </button>
                                <button
                                    onClick={() => handleEmail(supplier)}
                                    className="flex items-center justify-center gap-2 py-4 bg-blue-500/10 text-blue-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-blue-500/10 hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    <FaEnvelope size={14} /> Gmail
                                </button>
                            </div>

                            <button onClick={() => deleteHandler(supplier._id)} className="w-full py-4 bg-red-500/5 text-red-500/40 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                Terminate Connection
                            </button>
                        </div>
                    ))}
                </div>

                {suppliers.length === 0 && !loading && (
                    <div className="py-40 text-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <FaWarehouse size={40} className="text-slate-700" />
                        </div>
                        <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">No Active Links</h2>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/70">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[4rem] p-10 relative shadow-2xl">
                        <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 text-slate-500 hover:text-white transition-colors">
                            <FaTimes />
                        </button>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Node Initialisation</h2>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Create New Supplier Data-Link</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Company Designation</label>
                                <input name="name" onChange={handleChange} value={formData.name} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="e.g. PharmaCorp Global" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Liaison Name</label>
                                    <input name="contactPerson" onChange={handleChange} value={formData.contactPerson} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="Full Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Phone Matrix</label>
                                    <input name="phone" onChange={handleChange} value={formData.phone} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="+91 ..." required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Digital Mailbox</label>
                                <input type="email" name="email" onChange={handleChange} value={formData.email} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="contact@supplier.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Physical Coordinates</label>
                                <input name="address" onChange={handleChange} value={formData.address} className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-bold text-sm" placeholder="Building, Street, City" />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase text-xs tracking-widest mt-8 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                                Establish Linkage
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierList;
