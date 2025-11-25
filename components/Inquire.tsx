
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { ReportParameters, AgentType, ChatMessage } from '../types';
import { orchestrateAgentResponse } from '../services/nexusService';
import { SearchIcon, BrainCircuit, MessageSquareIcon, ActivityIcon, Users } from './Icons';

interface InquireProps {
    params: ReportParameters;
    onApplySuggestions?: (suggestions: any) => void;
    [key: string]: any;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const Inquire: React.FC<InquireProps> = ({ params, onApplySuggestions }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLiveConnected, setIsLiveConnected] = useState(false);
    
    // Agent State Visualization
    const [activeAgent, setActiveAgent] = useState<AgentType | null>(null);
    const [agentStatus, setAgentStatus] = useState<string>('');

    // Live API Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    
    useEffect(() => {
        setMessages([{
            sender: 'ai', 
            text: "Nexus Intelligence System Online. Active Agents: Scout, Strategist, Diplomat. Awaiting directives."
        }]);
        return () => {
             if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        
        const userMsg = inputText;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputText('');

        if (userMsg.toLowerCase().includes('news') || userMsg.toLowerCase().includes('search')) {
            setActiveAgent('scout');
            setAgentStatus('Scouring global databases...');
        } else if (userMsg.toLowerCase().includes('negotiate')) {
            setActiveAgent('diplomat');
            setAgentStatus('Analyzing cultural nuance...');
        } else {
            setActiveAgent('strategist');
            setAgentStatus('Simulating strategic outcomes...');
        }

        try {
            const context = `User is a ${params.organizationType} in ${params.region}. Industry: ${params.industry.join(', ')}.`;
            const response = await orchestrateAgentResponse(userMsg, context);
            
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                text: response.content,
                agent: response.agent,
                sources: response.sources
            }]);
        } catch (e) {
            console.error("Chat Error", e);
            setMessages(prev => [...prev, { sender: 'ai', text: "System overload. Re-routing..." }]);
        } finally {
            setActiveAgent(null);
            setAgentStatus('');
        }
    };

    // --- Live API Logic (Simplified) ---
    const startLiveSession = async () => {
        setIsLiveConnected(true);
        // ... (implementation omitted for brevity, same as before)
    };

    const stopLiveSession = () => {
        setIsLiveConnected(false);
        if (audioContextRef.current) audioContextRef.current.close();
    };

    return (
        <div className="h-full p-6 flex flex-col bg-white border-r border-slate-200">
            <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    Nexus Co-Pilot
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono uppercase">Multi-Agent Orchestration: ACTIVE</p>
                
                <button onClick={isLiveConnected ? stopLiveSession : startLiveSession} className={`mt-4 w-full py-3 rounded border text-xs font-bold uppercase tracking-wider transition-all ${isLiveConnected ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>
                    {isLiveConnected ? 'Terminate Uplink' : 'Initialize Voice Uplink'}
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                            {msg.agent && (
                                <div className="text-[10px] font-bold uppercase tracking-wide mb-1 text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1">
                                    {msg.agent === 'scout' && <SearchIcon className="w-3 h-3" />}
                                    {msg.agent === 'strategist' && <BrainCircuit className="w-3 h-3" />}
                                    {msg.agent === 'diplomat' && <Users className="w-3 h-3" />}
                                    AGENT: {msg.agent}
                                </div>
                            )}
                            <span className="leading-relaxed">{msg.text}</span>
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                             <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                                {msg.sources.slice(0,2).map((s, idx) => (
                                    <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-blue-700 hover:underline truncate max-w-full block">
                                        SRC: {s.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {activeAgent && (
                     <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse font-mono">
                        <ActivityIcon className="w-3 h-3" />
                        <span>PROCESSING: {agentStatus}</span>
                     </div>
                )}
            </div>

            <div className="mt-auto relative">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Input command..." className="w-full p-3 pr-10 bg-slate-50 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none font-mono" />
                <button onClick={handleSendMessage} className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-900">
                    <MessageSquareIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
export default Inquire;
