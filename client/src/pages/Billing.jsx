import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaTrash, FaPlus, FaMinus, FaExclamationTriangle, FaDownload, FaWhatsapp, FaMagic, FaSearch, FaRobot, FaMicrochip, FaTimes } from 'react-icons/fa';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Billing = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [interactionAlerts, setInteractionAlerts] = useState([]);
    const [foodWarnings, setFoodWarnings] = useState([]);
    const [substitutes, setSubstitutes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const navigate = useNavigate();
    let userInfo = null;
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) userInfo = JSON.parse(stored);
    } catch (e) {
        console.error("Auth parse error", e);
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            fetchMeds();
        }
    }, [navigate, userInfo?.token]);

    const fetchMeds = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/medicines', config);
            setMedicines(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setLoading(false);
        }
    };

    const fetchSubstitutes = async (name) => {
        try {
            const { data } = await axios.get(`/api/substitutes?name=${name}`);
            setSubstitutes(data.substitutes || []);
        } catch (e) { console.error(e); }
    };

    const startScanner = () => {
        setShowScanner(true);
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            scanner.render((decodedText) => {
                try {
                    const data = JSON.parse(decodedText);
                    const med = medicines.find(m => (m._id || m.id) === data.id);
                    if (med) {
                        addToCart(med);
                        scanner.clear();
                        setShowScanner(false);
                    }
                } catch (e) { console.error("Invalid QR", e); }
            }, (err) => { });
        }, 300);
    };

    const addToCart = (med) => {
        const existItem = cart.find((x) => x.medicine === (med._id || med.id));
        if (existItem) {
            updateQuantity(med._id || med.id, 'inc', med.stock);
            return;
        }

        const newCart = [...cart, {
            medicine: med._id || med.id,
            name: med.name,
            price: med.price,
            stock: med.stock,
            quantity: 1,
            amount: Number(med.price)
        }];
        setCart(newCart);
        checkAdvancedInteractions(newCart.map(item => item.name));

        if (med.stock < 5) {
            fetchSubstitutes(med.name);
        } else {
            setSubstitutes([]);
        }
    };

    const checkAdvancedInteractions = async (medNames) => {
        try {
            const { data } = await axios.post('/api/check-interactions', {
                medicines: medNames.map(name => ({ name }))
            });
            setInteractionAlerts(data.interactions || []);
            setFoodWarnings(data.food_warnings || []);
            if ((data.interactions?.length > 0) || (data.food_warnings?.length > 0)) {
                setShowModal(true);
            }
        } catch (error) { console.error("AI Check failed", error); }
    };

    const removeFromCart = (id) => setCart(cart.filter((x) => x.medicine !== id));

    const updateQuantity = (id, check, stock) => {
        const item = cart.find((x) => x.medicine === id);
        if (check === 'inc') {
            if (item.quantity + 1 > stock) return;
            const newQty = item.quantity + 1;
            setCart(cart.map((x) => x.medicine === id ? { ...x, quantity: newQty, amount: newQty * Number(x.price) } : x));
        } else if (check === 'dec') {
            if (item.quantity === 1) removeFromCart(id);
            else {
                const newQty = item.quantity - 1;
                setCart(cart.map((x) => x.medicine === id ? { ...x, quantity: newQty, amount: newQty * Number(x.price) } : x));
            }
        }
    };

    const calculateTotal = () => cart.reduce((acc, item) => acc + item.amount, 0);

    const submitBill = async (type = 'print') => {
        if (cart.length === 0 || !customerName) {
            alert("Please add items and customer name!");
            return;
        }

        if (type === 'whatsapp' && !customerPhone) {
            alert("Please enter patient's phone number for WhatsApp!");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const billData = { customerName, customerPhone, items: cart, totalAmount: calculateTotal() };

            const { data } = await axios.post('/api/bills', billData, config);

            if (type === 'whatsapp') {
                const message = `*AI-DRIVEN PHARMA INVOICE*\n\n` +
                    `Patient: *${customerName}*\n` +
                    `Ref ID: #${data._id?.slice(-6).toUpperCase()}\n\n` +
                    `*Prescription Detail:* \n` +
                    cart.map(item => `- ${item.name} (Qty: ${item.quantity}) @ ₹${item.price}`).join('\n') +
                    `\n\n*Total Payable: ₹${calculateTotal().toLocaleString()}*` +
                    `\n\n_Thank you for trust in MedManage AI Systems._`;

                let phone = customerPhone.replace(/\D/g, '');
                if (phone.length === 10) phone = '91' + phone;

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }

            if (type === 'print') {
                const invoiceResponse = await axios.post('/api/generate-invoice', {
                    customer: customerName,
                    phone: customerPhone,
                    items: cart,
                    total: calculateTotal()
                }, { responseType: 'blob' });

                const url = window.URL.createObjectURL(new Blob([invoiceResponse.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Invoice_${customerName}.pdf`);
                document.body.appendChild(link);
                link.click();
            }

            setCart([]);
            setCustomerName('');
            setCustomerPhone('');
            setSubstitutes([]);
            fetchMeds();
            alert(`SUCCESS: Terminal Reset. Bill generated.`);
        } catch (error) {
            alert("Terminal Error: " + (error.response?.data?.detail || error.message));
        }
    };

    const AlertModal = () => (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[2000] px-4">
            <div className="bg-[#0f172a] border border-red-500/30 rounded-[3rem] shadow-3xl max-w-xl w-full overflow-hidden animate-in zoom-in duration-300 relative">
                <div className="bg-red-600/20 p-10 flex items-center gap-6 border-b border-red-500/20">
                    <div className="p-4 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/30">
                        <FaExclamationTriangle size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Neural Interaction Alert</h3>
                        <p className="text-red-400 font-bold uppercase text-[10px] tracking-widest mt-1">AI Safety Protocols Triggered</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="ml-auto text-slate-500 hover:text-white transition-all"><FaTimes size={24} /></button>
                </div>
                <div className="p-10">
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {interactionAlerts.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Critical Drug Interactions</p>
                                <div className="space-y-4">
                                    {interactionAlerts.map((i, idx) => (
                                        <div key={idx} className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl">
                                            <span className="font-black text-rose-500 uppercase text-xs italic tracking-tight">{i.medicines.join(' + ')}</span>
                                            <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">{i.warning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {foodWarnings.length > 0 && (
                            <div className="mt-8">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4">Dietary Contraindications</p>
                                <div className="space-y-4">
                                    {foodWarnings.map((f, idx) => (
                                        <div key={idx} className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">!</div>
                                                <span className="font-black text-amber-500 uppercase text-xs italic tracking-tight">{f.medicine}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 font-bold leading-relaxed">{f.warning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-full mt-8 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all">Dismiss Protocols</button>
                </div>
            </div>
        </div>
    );

    const filteredMedicines = medicines.filter(med => (med.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()));

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">Initializing Billing Matrix...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans">
            {/* Background Aurora */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            {showModal && <AlertModal />}

            <div className="max-w-[1750px] mx-auto px-6 py-10 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Catalog Section */}
                    <div className="flex-1 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar">
                        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
                                    Point of <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Sale</span>
                                </h2>
                                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Active Dispensing Terminal • RX-7729</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={startScanner} className="w-14 h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                                    <FaQrcode size={24} />
                                </button>
                                <button onClick={() => navigate('/smart-rx')} className="px-8 h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-2xl">
                                    <FaMicrochip size={16} /> Neural OCR
                                </button>
                            </div>
                        </header>

                        {showScanner && <div id="reader" className="mb-8 rounded-[2.5rem] overflow-hidden border-2 border-purple-500/20 bg-black/40 p-4 shadow-3xl"></div>}

                        <div className="relative mb-10 group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Scan or type medicine signature..."
                                className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-900/50 border border-white/5 focus:border-purple-500 outline-none font-bold text-white transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredMedicines.map((med) => (
                                <div key={med._id || med.id} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/40 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-black text-white uppercase italic tracking-tighter text-xl truncate pr-4">{med.name}</h3>
                                            <p className="font-black text-indigo-400 text-lg italic">₹{med.price}</p>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">{med.category}</p>
                                        <div className="flex items-center gap-2 mb-8">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Availability: {med.stock} Nodes</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(med)}
                                        disabled={med.stock === 0}
                                        className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-20 translate-y-2 group-hover:translate-y-0"
                                    >
                                        {med.stock === 0 ? 'Protocol Locked' : <><FaPlus /> Add to Buffer</>}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* AI Section */}
                        {substitutes.length > 0 && (
                            <div className="mt-12 bg-indigo-900/20 p-10 rounded-[4rem] border border-indigo-500/10 shadow-3xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                        <FaRobot size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Neural Salt Substitutes</h3>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {substitutes.map((s, idx) => (
                                        <button key={idx} className="px-8 py-4 bg-slate-900 border border-indigo-500/20 rounded-2xl font-black text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all uppercase text-[10px] tracking-widest">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terminal Sidebar */}
                    <div className="lg:w-[450px]">
                        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] p-10 lg:p-12 sticky top-10 border border-white/5 shadow-3xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_100%] animate-[gradient_3s_linear_infinite]"></div>

                            <h2 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase italic flex items-center gap-4">
                                <FaMicrochip className="text-purple-500" /> Terminal <span className="text-slate-500">I/O</span>
                            </h2>

                            <div className="space-y-4 mb-10">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Personnel Signal</label>
                                    <input type="text" placeholder="PATIENT NAME" className="w-full px-6 py-5 rounded-2xl bg-black/40 border-2 border-slate-800 focus:border-purple-500 font-black text-xs uppercase text-white outline-none transition-all" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] ml-4">Communication Line</label>
                                    <input type="text" placeholder="WHATSAPP PHONE" className="w-full px-6 py-5 rounded-2xl bg-black/40 border-2 border-slate-800 focus:border-purple-500 font-black text-xs uppercase text-white outline-none transition-all" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-12 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.length > 0 ? cart.map((item) => (
                                    <div key={item.medicine} className="bg-black/30 p-5 rounded-3xl flex items-center gap-4 border border-white/5 group/item">
                                        <div className="flex-1">
                                            <h4 className="font-black text-white text-[11px] uppercase italic tracking-tighter truncate">{item.name}</h4>
                                            <p className="text-[9px] font-black text-slate-500 mt-1">₹{item.price} • {item.quantity} UNITS</p>
                                        </div>
                                        <div className="flex items-center bg-slate-800/80 rounded-xl px-2 py-1 gap-3">
                                            <button onClick={() => updateQuantity(item.medicine, 'dec', item.stock)} className="text-slate-500 hover:text-rose-500 transition-colors p-1"><FaMinus size={10} /></button>
                                            <span className="font-black text-xs text-white w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.medicine, 'inc', item.stock)} className="text-slate-500 hover:text-emerald-500 transition-colors p-1"><FaPlus size={10} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.medicine)} className="text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover/item:opacity-100"><FaTrash size={12} /></button>
                                    </div>
                                )) : (
                                    <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] animate-pulse">Buffer Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/5 pt-10">
                                <div className="flex flex-col mb-10">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Total Valuation</span>
                                    <span className="text-5xl font-black text-white italic tracking-tighter">₹{calculateTotal().toLocaleString()}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => submitBill('whatsapp')}
                                        disabled={cart.length === 0 || !customerName}
                                        className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-20"
                                    >
                                        <FaWhatsapp size={20} className="animate-bounce" /> Send Signal via WhatsApp
                                    </button>
                                    <button
                                        onClick={() => submitBill('print')}
                                        disabled={cart.length === 0 || !customerName}
                                        className="w-full py-5 bg-slate-800 border border-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                                    >
                                        <FaDownload /> Download Encrypted PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default Billing;
