import { useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaArrowLeft, FaSearch, FaRobot, FaAppleAlt, FaTint, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DietaryAdvisor = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState(null);
    const navigate = useNavigate();

    const getAdvice = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // 1. Fetch Food-Medicine Interactions
            const { data: interactionData } = await axios.post('/api/check-interactions', {
                medicines: [{ name: query }]
            });

            // 2. Fetch AI Dietary Recommendations
            const { data: dietData } = await axios.post('/api/ai-diet', {
                query: query
            });

            // 3. Fetch Substitutes
            const { data: subData } = await axios.get(`/api/substitutes?name=${encodeURIComponent(query)}`);

            console.log("AI Data Received:", { dietData, subData });

            setAdvice({
                food_warnings: interactionData.food_warnings || [],
                diet: dietData,
                substitutes: subData.substitutes || []
            });
        } catch (error) {
            console.error("DIETARY ANALYSIS CRITICAL ERROR:", error);
            // Fallback for UI stability
            setAdvice({
                food_warnings: [],
                diet: {
                    fruit: "Seasonal Fruits (Fallback)",
                    water: "3-4 Liters/Day",
                    avoid: "Junk Food",
                    message: `System Error: ${error.message}. The AI Engine might be restarting or unreachable.`
                },
                substitutes: []
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 font-sans overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/5 blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 hover:text-orange-400 transition-colors">
                        <FaArrowLeft /> Dashboard
                    </button>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
                        Vision-Pro <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Dietary Intelligence</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Personalized Nutrition & Medicine-Food Interaction Engine</p>
                </header>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl mb-12">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter Medicine Name or Medical Condition (e.g. Diabetes, Atorvastatin)"
                                className="w-full bg-black/40 border border-slate-800 rounded-3xl p-6 pl-14 text-white outline-none focus:border-orange-500/50 transition-all font-bold"
                            />
                        </div>
                        <button
                            onClick={getAdvice}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-400 text-black px-12 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Analyze Diet"}
                        </button>
                    </div>
                </div>

                {advice ? (
                    <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Diet Plan */}
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
                                    <FaUtensils />
                                </div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">AI Recommended <span className="text-orange-400">Diet</span></h3>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaAppleAlt className="text-orange-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Fruits</span>
                                    </div>
                                    <p className="text-lg font-bold italic">{advice.diet.fruit}</p>
                                </div>
                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaTint className="text-blue-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydration Goal</span>
                                    </div>
                                    <p className="text-lg font-bold italic">{advice.diet.water}</p>
                                </div>
                                {advice.diet.message && (
                                    <div className="bg-orange-500/5 p-6 rounded-3xl border border-orange-500/10">
                                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">AI Medical Insight</p>
                                        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{advice.diet.message}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Substitution Column */}
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                    <FaSearch />
                                </div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Drug <span className="text-indigo-400">Substitution</span></h3>
                            </div>

                            <div className="space-y-6">
                                {advice.substitutes.length > 0 ? (
                                    advice.substitutes.map((sub, i) => (
                                        <div key={i} className="bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                                                {i + 1}
                                            </div>
                                            <p className="text-lg font-bold italic text-indigo-100">{sub}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-slate-800/20 p-10 rounded-3xl text-center border border-white/5">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Direct Substitutes Found</p>
                                    </div>
                                )}
                                <div className="mt-4 p-4 border-t border-white/5">
                                    <p className="text-[8px] text-slate-600 font-black uppercase leading-tight tracking-widest">Note: Always consult a licensed pharmacist before switching medicine brands.</p>
                                </div>
                            </div>
                        </div>

                        {/* Restrictions & Warnings */}
                        <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                                    <FaBan />
                                </div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Forbidden <span className="text-rose-500">Protocols</span></h3>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <FaBan className="text-rose-500" />
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Avoid (Foods to Limit)</span>
                                    </div>
                                    <p className="text-lg font-bold italic text-rose-400">{advice.diet.avoid}</p>
                                </div>

                                {advice.food_warnings.length > 0 && (
                                    <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Medicine Interaction Warning</span>
                                        {advice.food_warnings.map((w, i) => (
                                            <div key={i} className="mb-4 last:mb-0">
                                                <p className="text-xs font-black text-orange-400 uppercase italic mb-1">Target: {w.medicine}</p>
                                                <p className="text-sm font-medium text-slate-400 leading-relaxed">{w.warning}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <FaRobot size={60} className="mx-auto text-slate-800 mb-8 animate-bounce" />
                        <h2 className="text-xl font-black text-slate-600 uppercase tracking-[0.3em]">Neural Engine Standby</h2>
                        <p className="text-slate-600 mt-2 font-bold italic">Enter a query above to initialize dietary analysis</p>
                    </div>
                )}

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Smart Balancing", desc: "AI calculates nutrients based on drug metabolism.", icon: <FaCheckCircle /> },
                        { title: "Interaction Shield", desc: "Prevents toxic medicine-food combinations.", icon: <FaCheckCircle /> },
                        { title: "Recovery Speed", desc: "Optimized vitamins to boost healing phases.", icon: <FaCheckCircle /> }
                    ].map((feature, i) => (
                        <div key={i} className="flex gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <div className="text-orange-500 mt-1">{feature.icon}</div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">{feature.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DietaryAdvisor;
