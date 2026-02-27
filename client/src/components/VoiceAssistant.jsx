import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaStop, FaTimes, FaRobot } from 'react-icons/fa';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    // UseMemo to prevent repeated SpeechRecognition instance creation
    const recognition = useMemo(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';
        return rec;
    }, []);

    const processCommand = useCallback((command) => {
        const cmd = command.toLowerCase();
        console.log("Processing Command:", cmd);

        if (cmd.includes('dashboard') || cmd.includes('home')) {
            navigate('/dashboard');
        } else if (cmd.includes('billing') || cmd.includes('cart') || cmd.includes('sell')) {
            navigate('/billing');
        } else if (cmd.includes('inventory') || cmd.includes('stock')) {
            navigate('/inventory');
        } else if (cmd.includes('forecast') || cmd.includes('prediction') || cmd.includes('trend')) {
            navigate('/predictions');
        } else if (cmd.includes('report')) {
            navigate('/reports');
        } else if (cmd.includes('profile')) {
            navigate('/profile');
        } else if (cmd.includes('prescription') || cmd.includes('scan')) {
            navigate('/smart-prescription');
        } else if (cmd.includes('expiry')) {
            navigate('/expiry-risk');
        } else if (cmd.includes('patient') || cmd.includes('health')) {
            navigate('/patient-care');
        }

        setTimeout(() => setIsVisible(false), 2000);
    }, [navigate]);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const resultTranscript = event.results[current][0].transcript;
            setTranscript(resultTranscript);
            processCommand(resultTranscript);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
    }, [processCommand, recognition]);

    const toggleListening = () => {
        if (!recognition) return;
        if (isListening) {
            recognition.stop();
        } else {
            setTranscript('Listening...');
            setIsVisible(true);
            try {
                recognition.start();
                setIsListening(true);
            } catch (e) {
                console.error("Speech recognition error:", e);
                setIsListening(false);
            }
        }
    };

    if (!recognition) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[600] flex flex-col items-end gap-4">
            {isVisible && (
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-indigo-100 w-64 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                            <FaRobot /> Pharma-Bot
                        </div>
                        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl min-h-[60px] text-xs text-gray-700 italic border border-gray-100 font-medium">
                        "{transcript || 'Listening for your command...'}"
                    </div>
                </div>
            )}

            <button
                onClick={toggleListening}
                className={`p-5 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${isListening
                    ? 'bg-red-500 scale-110 animate-pulse text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:rotate-12'
                    }`}
            >
                {isListening ? <FaStop size={24} /> : <FaMicrophone size={24} />}
            </button>
        </div>
    );
};

export default VoiceAssistant;
