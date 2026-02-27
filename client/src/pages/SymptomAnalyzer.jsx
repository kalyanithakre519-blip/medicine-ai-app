import React, { useState } from 'react';
import axios from 'axios';
import { FaStethoscope, FaMagic, FaPlus, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaCapsules, FaUserMd, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SymptomAnalyzer = () => {
    const [symptoms, setSymptoms] = useState('');
    const [phone, setPhone] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!symptoms) return;
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/symptom-analysis', { symptoms, phone });
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('AI Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 lg:p-8 font-sans">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700/50">
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">
                            AI Symptom Analyzer
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Intelligent Diagnostic Recommendation Engine</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase text-emerald-500">Medical AI v2.0 Live</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-8 backdrop-blur-xl shadow-2xl">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                            <FaStethoscope className="text-emerald-500 text-2xl" />
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tight">How are you feeling?</h2>
                        <p className="text-slate-400 text-sm font-medium mb-6 italic">Enter your symptoms in plain English or Hindi (e.g., Stomach pain, Headache, Fever...)</p>

                        <div className="flex flex-col gap-4 mb-6">
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold outline-none"
                                placeholder="Patient Phone (Optional - For Allergy Check)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <textarea
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-6 text-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold min-h-[140px] outline-none"
                                placeholder="Type symptoms here (e.g., Stomach pain, Fever...)"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !symptoms}
                            className={`w-full mt-6 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl ${loading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-slate-500 border-t-emerald-500 rounded-full animate-spin"></div>
                                    Analyzing Symptoms...
                                </>
                            ) : (
                                <>
                                    <FaMagic /> Run AI Diagnosis
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8">
                        <FaUserMd className="text-indigo-500 text-2xl mb-4" />
                        <h4 className="text-lg font-black mb-2 tracking-tight">AI Note</h4>
                        <p className="text-slate-400 text-sm leading-relaxed italic">"Our AI maps your symptoms to established medical patterns from thousands of records to suggest the most effective over-the-counter relief."</p>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3">
                    {!result ? (
                        <div className="h-full bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                            <FaMagic size={60} className="text-slate-700 mb-6" />
                            <h3 className="text-2xl font-black text-slate-600 uppercase tracking-widest leading-none">Awaiting Symptoms</h3>
                        </div>
                    ) : result.status === 'Success' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Neural diagnosis results</h3>

                            {result.analysis.map((dx, idx) => (
                                <div key={idx} className="bg-slate-900 border border-emerald-500/30 rounded-[3rem] p-10 relative overflow-hidden group">
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-600/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-5 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">AI Detection Match</span>
                                            <h2 className="text-3xl font-black italic tracking-tighter text-white underline decoration-emerald-500/30 decoration-4 underline-offset-8">
                                                {dx.diagnosis}
                                            </h2>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                                            <div className="bg-black/20 p-6 rounded-3xl border border-white/5 relative">
                                                {dx.margin_note && (
                                                    <span className="absolute -top-3 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-[9px] font-black uppercase rounded-full border border-green-500/30">
                                                        Best Margin Options
                                                    </span>
                                                )}
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FaCapsules className="text-indigo-400" /> Recommended Relief
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {dx.medicines.map((med, i) => {
                                                        const isAllergic = dx.allergic_matches && dx.allergic_matches.includes(med);
                                                        return (
                                                            <span
                                                                key={i}
                                                                className={`px-4 py-2 ${isAllergic ? 'bg-red-500/20 text-red-500 border-red-500/50 line-through' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'} border rounded-xl font-black text-xs uppercase tracking-tight`}
                                                            >
                                                                {med}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FaLightbulb className="text-yellow-400" /> Safe Substitutes
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {dx.substitutes && dx.substitutes.length > 0 ? (
                                                        dx.substitutes.map((sub, i) => {
                                                            const isSubAllergic = dx.allergic_matches && dx.allergic_matches.some(a => a.toLowerCase() === sub.toLowerCase());
                                                            return (
                                                                <span key={`sub-${i}`} className={`px-4 py-2 ${isSubAllergic ? 'bg-red-500/10 text-red-500 border border-red-500/30 line-through' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'} rounded-xl font-black text-xs uppercase tracking-tight`}>
                                                                    {sub}
                                                                </span>
                                                            )
                                                        })
                                                    ) : (
                                                        <span className="text-xs text-slate-500 font-bold italic">No substitutes available</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FaCheckCircle className="text-emerald-400" /> Professional Advice
                                                </p>
                                                <p className="text-slate-300 font-bold italic text-sm">{dx.advice}</p>
                                            </div>
                                        </div>

                                        {dx.allergy_warning && (
                                            <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
                                                <FaExclamationTriangle className="text-red-500 mt-0.5" />
                                                <p className="text-red-400 text-xs font-bold leading-relaxed">{dx.allergy_warning}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={() => navigate('/billing')}
                                                className="flex-1 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                            >
                                                <FaPlus /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 flex items-start gap-4">
                                <FaExclamationTriangle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                                <p className="text-red-400/80 text-xs font-bold leading-relaxed italic">
                                    {result.warning}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-900/50 border border-red-500/20 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <FaExclamationTriangle size={60} className="text-red-500 mb-6" />
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">No Match Found</h3>
                            <p className="text-slate-400 max-w-sm font-bold uppercase tracking-widest text-[10px]">
                                {result.message}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SymptomAnalyzer;
