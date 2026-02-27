import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus, FaExternalLinkAlt } from 'react-icons/fa';

const PharmaChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Namaste! I am your AI Health Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulated AI Logic
        setTimeout(() => {
            let botResponse = "I am processing your query...";
            const query = input.toLowerCase();

            if (query.includes('metformin')) {
                botResponse = "Metformin is used for Diabetes. Recommendation: Take with meals to reduce stomach upset. Avoid alcohol.";
            } else if (query.includes('aspirin')) {
                botResponse = "Aspirin is a blood thinner. Warning: Do not take with other NSAIDs like Ibuprofen without consultation.";
            } else if (query.includes('hello') || query.includes('hi')) {
                botResponse = "Hello! I can tell you about drug usages, interactions, or check store protocols. What medicine are we looking at?";
            } else if (query.includes('gst') || query.includes('tax')) {
                botResponse = "Our system automatically calculates 12% GST on all medical supplies as per government norms.";
            } else {
                botResponse = "That's a specific query. I'll note that down for our head pharmacist. For safety, always check the prescription batch number.";
            }

            setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <>
            {/* Floating Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-[100] border-4 border-white"
            >
                <FaRobot size={28} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-44 right-6 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden z-[101] border border-gray-100 animate-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <FaRobot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight">HealthBot AI</h3>
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-all">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50 custom-scrollbar">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold shadow-sm ${m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-3xl border border-gray-100 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask about dosages, generic salt..."
                                className="w-full pl-6 pr-14 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </div>
                        <p className="text-center text-[9px] font-black text-gray-300 uppercase mt-4 tracking-tighter">
                            AI may provide general info. Always consult a doctor.
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </>
    );
};

export default PharmaChatbot;
