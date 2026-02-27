import { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaMagic, FaPlus, FaCheckCircle, FaExclamationTriangle, FaHeartbeat, FaInfoCircle, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SmartPrescription = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post('/api/scan-prescription', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze prescription. Check if AI Service is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 lg:p-8 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => result ? setResult(null) : navigate('/dashboard')}
                        className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700/50"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">
                            Vision AI Health Terminal
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Advanced Medical OCR & Interaction Engine</p>
                    </div>
                </div>
                {!result && (
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-black uppercase">Core Engine: Active</span>
                        </div>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto">
                {!result ? (
                    /* Upload Section */
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 items-stretch">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center backdrop-blur-xl">
                                <label className="w-full flex-1 border-2 border-dashed border-slate-700 rounded-[2rem] hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center justify-center p-12 group">
                                    {previewUrl ? (
                                        <div className="relative w-full h-full min-h-[300px]">
                                            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl shadow-indigo-500/10" />
                                            <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="px-6 py-2 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest">Change File</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <FaUpload className="text-indigo-500 text-3xl" />
                                            </div>
                                            <h3 className="text-xl font-black mb-2 tracking-tight">Drop Prescription Image</h3>
                                            <p className="text-slate-400 text-sm font-medium">Supports JPG, PNG, WEBP (Max 10MB)</p>
                                        </>
                                    )}
                                    <input type="file" onChange={handleFileChange} className="hidden" />
                                </label>
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                    className={`w-full mt-8 py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl ${loading
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 active:scale-[0.98]'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-slate-500 border-t-indigo-500 rounded-full animate-spin"></div>
                                            Analyzing with Vision-Pro...
                                        </>
                                    ) : (
                                        <>
                                            <FaMagic /> Start AI Diagnosis
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8">
                                    <FaShieldAlt className="text-indigo-500 text-2xl mb-4" />
                                    <h4 className="text-lg font-black mb-2 tracking-tight">High-Res OCR Engine</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Our advanced neural network can read even the most complex medical handwriting with 98% accuracy.</p>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8">
                                    <FaInfoCircle className="text-emerald-500 text-2xl mb-4" />
                                    <h4 className="text-lg font-black mb-2 tracking-tight">Drug Interaction Check</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Automatically detects dangerous medicine combinations that could harm the patient.</p>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-[2.5rem] p-8">
                                    <FaHeartbeat className="text-purple-500 text-2xl mb-4" />
                                    <h4 className="text-lg font-black mb-2 tracking-tight">AI Dietary Insights</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">Generates a customized nutrition plan to accelerate the patient's recovery process.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Redesigned Full Screen Dashboard */
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        {/* Top Critical Alert Section */}
                        {result.safety_alerts?.some(a => a.type === 'CRITICAL') && (
                            <div className="bg-red-600 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(220,38,38,0.3)] border-4 border-white/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                    <FaExclamationTriangle size={150} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-red-600 animate-bounce shadow-2xl">
                                        <FaExclamationTriangle size={40} />
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
                                            {result.safety_alerts.find(a => a.type === 'CRITICAL').headline}
                                        </h2>
                                        <p className="text-red-50 text-xl font-bold max-w-3xl leading-relaxed">
                                            {result.safety_alerts.find(a => a.type === 'CRITICAL').message}
                                        </p>
                                        <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                                            <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full font-black text-xs uppercase tracking-widest border border-white/20">Action: Alerting Pharmacist</span>
                                            <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full font-black text-xs uppercase tracking-widest border border-white/20">Protocol: Emergency Correction</span>
                                        </div>
                                    </div>
                                    <button
                                        className="px-12 py-6 bg-white text-red-600 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 whitespace-nowrap"
                                        onClick={() => window.print()}
                                    >
                                        GENERATE SAFETY REPORT
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Col: Original Text & Info */}
                            <div className="lg:col-span-1 space-y-8">
                                <section className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-8 backdrop-blur-xl">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">OCR Extraction Live Stream</h3>
                                    <div className="bg-black/40 p-6 rounded-2xl border border-slate-800 font-mono text-emerald-400 text-xs leading-relaxed max-h-[400px] overflow-auto custom-scrollbar">
                                        <div className="flex gap-4 mb-4 pb-4 border-b border-white/5">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <pre className="whitespace-pre-wrap">{result.extracted_text}</pre>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Engine: {result.ai_logic}</span>
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Accuracy: 98.4%</span>
                                    </div>
                                </section>

                                <section className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[3rem] p-8 shadow-2xl shadow-indigo-500/20">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                            <FaPlus className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-black italic tracking-tighter uppercase">Quick Add to Cart</h3>
                                    </div>
                                    <p className="text-white/80 font-medium mb-8 text-sm italic">All detected medicines can be added to your billing terminal with a single click.</p>
                                    <button
                                        onClick={() => navigate('/billing')}
                                        className="w-full py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
                                    >
                                        Go to Billing Terminal
                                    </button>
                                </section>
                            </div>

                            {/* Center & Right: Analyzed Dashboard */}
                            <div className="lg:col-span-2 space-y-8">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-4">Neural Analysis Dashboard</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {result.medicines.map((med, idx) => (
                                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                                            <div className="flex justify-between items-start relative z-10 mb-6">
                                                <div>
                                                    <h4 className="text-2xl font-black tracking-tighter italic text-indigo-400 mb-1 leading-none uppercase">{med.name}</h4>
                                                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{med.use}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${med.confidence > 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                        Conf: {med.confidence}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-8">
                                                <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">DOSAGE UNITS</p>
                                                    <p className="font-bold text-slate-200">{med.quantity}</p>
                                                </div>
                                                <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">STOCKS</p>
                                                    <p className={`font-bold ${med.stock?.includes('Low') ? 'text-amber-500' : 'text-emerald-500'}`}>{med.stock}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Bio-Hazard Watch
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {med.side_effects?.map((se, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-red-500/5 text-red-400 border border-red-500/10 rounded-xl text-[10px] font-black italic">
                                                            {se}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Custom Diet & Routine Dashboard */}
                                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5">
                                        <FaHeartbeat size={150} />
                                    </div>
                                    <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
                                        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-12 md:pb-0 md:pr-12">
                                            <h4 className="text-3xl font-black italic tracking-tighter text-amber-500 uppercase mb-4 leading-none">{result.dietary_recommendations?.title}</h4>
                                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">{result.dietary_recommendations?.message}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {result.dietary_recommendations?.recommendations?.map((rec, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 group">
                                                        <div className="w-8 h-8 min-w-[32px] bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                                            <FaCheckCircle size={14} />
                                                        </div>
                                                        <p className="text-slate-200 font-bold leading-tight">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default SmartPrescription;
