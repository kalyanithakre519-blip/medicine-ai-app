import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaCrown, FaCheckCircle, FaRocket, FaWhatsapp, FaCopy } from 'react-icons/fa';

const Subscription = () => {
    const [copied, setCopied] = useState(false);
    const upiId = "kalyanithakre519-1@okicici";
    const amount = "500";
    const payeeName = "Kalyani Thakre";

    // UPI payment URI
    const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 lg:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-block p-3 bg-yellow-400/10 rounded-2xl mb-4 border border-yellow-400/20">
                        <FaCrown className="text-yellow-400 text-4xl animate-pulse" />
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4 italic italic bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        PREMIUM PLAN
                    </h1>
                    <p className="text-slate-400 text-lg font-medium">Unlock the full power of AI for your Pharmacy</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Benefits Card */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <FaRocket className="text-blue-400" /> Premium Features
                        </h2>
                        <ul className="space-y-5">
                            {[
                                "AI-Powered Patient Refill Predictions",
                                "Full Multi-Store Inventory Management",
                                "Automated Digital Invoicing & Tax Forms",
                                "PWA Mobile App Installation Support",
                                "Priority WhatsApp Health Alerts",
                                "24/7 Technical AI Support"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-4 group">
                                    <FaCheckCircle className="text-emerald-400 text-xl group-hover:scale-110 transition" />
                                    <span className="text-slate-300 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl">
                            <div className="flex justify-between items-center text-white">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider opacity-80">Subscription Price</p>
                                    <h3 className="text-4xl font-black">₹500 <span className="text-lg opacity-60">/ Month</span></h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">MOST POPULAR</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 -mr-16 -mt-16 rounded-full blur-3xl"></div>

                        <h2 className="text-2xl font-black mb-6 text-center tracking-tight">SCAN TO SUBSCRIBE</h2>

                        <div className="flex justify-center mb-8 bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 relative">
                            <QRCodeCanvas
                                value={upiUri}
                                size={220}
                                level={"H"}
                                includeMargin={true}
                                className="rounded-lg shadow-sm"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-between group/copy cursor-pointer" onClick={copyToClipboard}>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">UPI ID</p>
                                    <p className="font-bold text-slate-700 break-all">{upiId}</p>
                                </div>
                                <button className={`p-3 rounded-xl transition ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                    {copied ? <FaCheckCircle /> : <FaCopy />}
                                </button>
                            </div>

                            <div className="text-center space-y-3 pt-4">
                                <p className="text-sm font-bold text-slate-500 italic">
                                    "Payment karne ke baad apna Transaction Screenshot humein WhatsApp karein activation ke liye."
                                </p>

                                <a
                                    href={`https://wa.me/919623245915?text=Hi, Maine ₹500 ka payment kar diya hai subscription ke liye. UPI ID: ${upiId}`}
                                    className="block bg-[#25D366] text-white py-4 rounded-2xl font-black shadow-[0_10px_20px_-5px_rgba(37,211,102,0.4)] hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <FaWhatsapp className="text-2xl" /> VERIFY ON WHATSAPP
                                </a>
                            </div>
                        </div>

                        <p className="mt-8 text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">Powered by Kalyani Thakre Systems</p>
                    </div>
                </div>

                {/* FAQ / Info */}
                <div className="mt-16 grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                        <h4 className="font-bold mb-2 text-indigo-400">Instant Activation</h4>
                        <p className="text-sm text-slate-400 italic">Payment screenshot bhejne ke 5 minute ke andar aapka premium plan activate ho jayega.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                        <h4 className="font-bold mb-2 text-indigo-400">Cancel Anytime</h4>
                        <p className="text-sm text-slate-400 italic">Koi hidden hidden charges nahi. Aap kabhi bhi billing stop kar sakte hain.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                        <h4 className="font-bold mb-2 text-indigo-400">100% Secure</h4>
                        <p className="text-sm text-slate-400 italic">UPI Payments secured hain aur direct aapke account se verified hote hain.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
