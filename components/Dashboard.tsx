
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GlobeIcon, SearchIcon, CpuIcon, ExternalLinkIcon, SymbiosisIcon, AnalyzeIcon } from './Icons';
import { fetchLiveInsights, fetchIntelligenceForCategory } from '../services/geminiService';
import { getMultiAgentOrchestrator } from '../services/MultiAgentOrchestrator';
import { AgentHealthStatus, DashboardIntelligence, SymbiosisContext } from '../types';
import { TradeDisruptionWidget } from './TradeDisruptionAnalyzer';
import { MarketDiversificationWidget } from './MarketDiversificationDashboard';
import { DASHBOARD_CATEGORIES } from '../constants';
import Loader from './common/Loader';

interface Props {
  onAnalyze: (item: any) => void;
  onStartSymbiosis: (context: any) => void;
}

const mockChartData = [
  { month: 'Jan', risk: 30, opportunity: 45 },
  { month: 'Feb', risk: 35, opportunity: 52 },
  { month: 'Mar', risk: 25, opportunity: 58 },
  { month: 'Apr', risk: 40, opportunity: 55 },
  { month: 'May', risk: 35, opportunity: 65 },
  { month: 'Jun', risk: 45, opportunity: 70 },
];

const IntelligenceCard: React.FC<{ 
    item: DashboardIntelligence['items'][0]; 
    onAnalyze: (item: any) => void;
    onStartSymbiosis: (context: SymbiosisContext) => void;
}> = ({ item, onAnalyze, onStartSymbiosis }) => {
    
    const handleSymbiosisClick = (event: React.MouseEvent, topic: string, content: string) => {
        event.stopPropagation();
        onStartSymbiosis({
            topic: topic,
            originalContent: content,
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">{item.company}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => handleSymbiosisClick(e, `Strategic Implication for: ${item.company}`, item.implication)}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Start Symbiosis Chat"
                    >
                        <SymbiosisIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{item.details}</p>

            <div className="mt-auto space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Strategic Implication</p>
                        <button
                            onClick={(e) => handleSymbiosisClick(e, `Strategic Implication for: ${item.company}`, item.implication)}
                            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-all duration-200 opacity-70 hover:opacity-100"
                            title="Start Symbiosis Chat"
                        >
                            <SymbiosisIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">{item.implication}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                     <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">Src: {item.source}</span>
                     <div className="flex items-center gap-2">
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-100 px-2 py-1 rounded-md" title="Open Source">
                             <ExternalLinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => onAnalyze(item)} className="inline-flex items-center text-xs font-semibold text-white bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105">
                           Analyze <AnalyzeIcon className="w-3 h-3 ml-1" />
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<Props> = ({ onAnalyze, onStartSymbiosis }) => {
  const [agentHealth, setAgentHealth] = useState<AgentHealthStatus[]>([]);
  
  // Advanced Intel State
  const [intelligence, setIntelligence] = useState<DashboardIntelligence[]>([]);
  const [isIntelLoading, setIsIntelLoading] = useState(true);
  const [intelError, setIntelError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const hasFetched = useRef(false);

  useEffect(() => {
    // Initialize Agent Monitor
    const orchestrator = getMultiAgentOrchestrator();
    setAgentHealth(orchestrator.getAgentHealth());
    const interval = setInterval(() => {
        setAgentHealth(orchestrator.getAgentHealth());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadIntelligence = useCallback(async () => {
    setIsIntelLoading(true);
    setIntelError(null);
    setIntelligence([]);
    setActiveCategory('All');
    let hasFetchError = false;

    // Fetch live categories
    const fetchPromises = DASHBOARD_CATEGORIES.map(category =>
      fetchIntelligenceForCategory(category)
        .then(data => {
          setIntelligence(prev => {
            const newIntelligence = [...prev, data];
            // Sort to keep order consistent based on constant definition
            newIntelligence.sort((a, b) => DASHBOARD_CATEGORIES.indexOf(a.category) - DASHBOARD_CATEGORIES.indexOf(b.category));
            return newIntelligence;
          });
        })
        .catch(err => {
          console.error(`Failed to fetch category '${category}':`, err);
          hasFetchError = true;
        })
    );

    await Promise.all(fetchPromises);
    
    if (hasFetchError) {
      setIntelError("Some intelligence streams unavailable.");
    }
    setIsIntelLoading(false);
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadIntelligence();
  }, [loadIntelligence]);

  const uniqueCategories = useMemo(() => ['All', ...DASHBOARD_CATEGORIES], []);

  const filteredIntelligence = useMemo(() => 
    intelligence.filter(categoryData => 
        activeCategory === 'All' || categoryData.category === activeCategory
    ),
  [intelligence, activeCategory]);

  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Agent Network Status Panel */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <CpuIcon className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Neural Agent Network</h3>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full font-mono">ONLINE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agentHealth.map((agent) => (
                    <div key={agent.agentId} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-slate-300">{agent.agentId}</span>
                            <span className={`w-2 h-2 rounded-full ${agent.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>Latency: {Math.round(agent.averageResponseTime)}ms</span>
                            <span>Success: {Math.round(agent.successRate * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${Math.max(5, agent.successRate * 100)}%` }}></div>
                        </div>
                    </div>
                ))}
                {agentHealth.length === 0 && (
                     <div className="text-xs text-slate-400 italic col-span-3">Initializing agent swarm protocol...</div>
                )}
            </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Global Sentiment</p>
            <p className="text-2xl font-bold text-green-600 mt-1">Bullish</p>
            <p className="text-xs text-slate-500 mt-2">+12% vs last month</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Risk Index</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">Moderate</p>
            <p className="text-xs text-slate-500 mt-2">Geopolitical stabilization</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Active Signals</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
            <p className="text-xs text-slate-500 mt-2">Across 14 industries</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <p className="text-xs font-bold text-slate-400 uppercase">Partner Matches</p>
             <p className="text-2xl font-bold text-blue-600 mt-1">84</p>
             <p className="text-xs text-slate-500 mt-2">High compatibility</p>
          </div>
        </div>

        {/* Market Diversification Dashboard */}
        <div className="h-[500px]">
            <MarketDiversificationWidget />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Market Opportunity vs. Risk</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorOpp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="opportunity" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorOpp)" />
                  <Area type="monotone" dataKey="risk" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.1} fill="#94a3b8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
             <h3 className="text-sm font-bold text-slate-800 mb-6">Sector Velocity</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { name: 'Fintech', val: 85 },
                     { name: 'Health', val: 65 },
                     { name: 'Auto', val: 45 },
                     { name: 'Energy', val: 75 },
                     { name: 'Retail', val: 55 },
                   ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}}/>
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Bar dataKey="val" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Trade Disruption Analysis Widget */}
        <TradeDisruptionWidget 
            tradeVolume={75000000}
            tariffRate={25}
            originCountry="China"
            targetCountry="USA"
        />

        {/* Live Global Intelligence Feed (Enhanced) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <GlobeIcon className="w-6 h-6 text-orange-500" />
                        Global Intelligence Feed
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time strategic analysis streamed via Nexus satellites.</p>
                </div>
                
                {/* Category Navigation */}
                <div className="bg-slate-100 rounded-lg p-1 flex overflow-x-auto max-w-full">
                    {uniqueCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-bold transition-all
                            ${activeCategory === cat ?
                                'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {intelError && (
                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                    {intelError}
                 </div>
            )}

            {isIntelLoading && intelligence.length === 0 ? (
                <div className="py-12 flex justify-center">
                    <Loader message="Acquiring global signals..." />
                </div>
            ) : filteredIntelligence.length > 0 ? (
                <div className="space-y-12">
                     {filteredIntelligence.map((categoryData) => (
                        <div key={categoryData.category} className="animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                {categoryData.category}
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryData.items.map((item, index) => (
                                    <IntelligenceCard
                                        key={`${item.url}-${index}`}
                                        item={item}
                                        onAnalyze={onAnalyze}
                                        onStartSymbiosis={onStartSymbiosis}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <SearchIcon className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No intelligence found for this category.</p>
                    <button onClick={loadIntelligence} className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-semibold">
                        Refresh Feed
                    </button>
                </div>
            )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
