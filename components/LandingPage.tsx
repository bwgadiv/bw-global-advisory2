
import React from 'react';
import { 
    NexusLogo, Target, SymbiosisIcon, ActivityIcon, SearchIcon, 
    ShieldCheckIcon, Users, GlobeIcon, TrendingUp, CheckCircle,
    RocketIcon, ManualIcon, FileText, BrainCircuit
} from './Icons';

interface LandingPageProps {
    onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
            
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center bg-white border-b border-slate-200">
                <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

                <header className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-md">
                            <NexusLogo className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-900">BW Global Advisory</span>
                    </div>
                    <button 
                        onClick={onEnter}
                        className="text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Access Platform
                    </button>
                </header>

                <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                        System Online
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-tight">
                        Your Region’s Value,<br/>
                        <span className="text-slate-400">Understood Globally.</span>
                    </h1>
                    
                    <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-600 leading-relaxed">
                        <p>
                            For decades, regional cities, governments, and emerging markets have been the unsung engines of national prosperity — yet their potential remains invisible to global investors.
                        </p>
                        <p className="font-medium text-slate-900">
                            Not because the opportunities are small. <br/>
                            But because no one has ever built a system capable of seeing them.
                        </p>
                        <p className="text-sm uppercase tracking-widest font-bold text-slate-400 pt-4">
                            BW Nexus AI is the first platform in the world built to solve this century-old problem.
                        </p>
                    </div>

                    <div className="pt-8">
                        <button 
                            onClick={onEnter}
                            className="group relative px-10 py-4 bg-slate-900 text-white rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <span className="flex items-center gap-3">
                                Initialize Nexus AI
                                <Target className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- THE PROBLEM --- */}
            <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Problem</h3>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">The 100-Year Confidence Gap</h2>
                        <p className="mt-4 text-slate-600">For over a century, global opportunities have been blocked by three invisible barriers:</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-4xl font-bold text-slate-200 mb-4">01</div>
                            <h4 className="font-bold text-slate-900 mb-2">Intelligence was expensive.</h4>
                            <p className="text-sm text-slate-600">Only billion-dollar firms could afford research teams. Everyone else was left guessing.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-4xl font-bold text-slate-200 mb-4">02</div>
                            <h4 className="font-bold text-slate-900 mb-2">The unknown felt risky.</h4>
                            <p className="text-sm text-slate-600">Regions outside "famous markets" were dismissed because investors lacked confidence in the available data.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-4xl font-bold text-slate-200 mb-4">03</div>
                            <h4 className="font-bold text-slate-900 mb-2">No shared strategic language.</h4>
                            <p className="text-sm text-slate-600">Local leaders and global companies could not communicate using the same frameworks, creating misalignment.</p>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center max-w-2xl mx-auto">
                        <p className="text-slate-800 font-medium">
                            These forces created a global bottleneck: capital overflows into familiar places while emerging regions remain underestimated. 
                            <br/><span className="block mt-2 font-bold">BW Nexus AI exists to eliminate this gap permanently.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* --- THE TRUTH (CONSULTING CRITIQUE) --- */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">The Truth About Today’s Consulting System</h2>
                    <p className="text-lg text-slate-300 mb-12">
                        The world’s largest consulting firms are spending millions on AI. But they are not changing their model.
                        <span className="block mt-4 text-white font-bold text-2xl">They are simply strapping a rocket engine to a horse cart.</span>
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-700 pb-2">The Legacy Model (Built for 1970s)</h4>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-center gap-3"><span className="text-slate-500">✕</span> Slow manual research</li>
                                <li className="flex items-center gap-3"><span className="text-slate-500">✕</span> Expensive human teams</li>
                                <li className="flex items-center gap-3"><span className="text-slate-500">✕</span> Narrow market analysis</li>
                                <li className="flex items-center gap-3"><span className="text-slate-500">✕</span> Late-stage engagement only</li>
                                <li className="flex items-center gap-3"><span className="text-slate-500">✕</span> Prohibitive entry costs</li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xl leading-relaxed font-medium">
                                They cannot profitably support early-stage confidence building for smaller regions or SMEs.
                                <br/><br/>
                                <span className="text-slate-400">BW Nexus AI was built for the part of the process they have ignored for 100 years. The part where confidence begins.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE SOLUTION --- */}
            <section className="py-24 px-6 bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Solution</h3>
                        <h2 className="text-3xl font-bold text-slate-900">What BW Nexus AI Actually Is</h2>
                        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                            The world’s first <strong>Strategic Symbiosis System</strong> — an intelligence engine designed to reveal hidden potential between people, regions, industries, and markets.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon={<GlobeIcon className="w-6 h-6" />}
                            title="Global Matchmaking Engine"
                            desc="Identifies the best regions, partners, governments, and suppliers — even ones you didn’t know existed."
                        />
                        <FeatureCard 
                            icon={<ActivityIcon className="w-6 h-6" />}
                            title="Regional Economic DNA Scanner"
                            desc="Uses Location Quotient, I-O modelling, and symbiotic indicators to map true economic potential."
                        />
                        <FeatureCard 
                            icon={<TrendingUp className="w-6 h-6" />}
                            title="Predictive Symbiosis Engine"
                            desc="Forecasts the 'knock-on' effects of projects, policies, investments, and partnerships."
                        />
                        <FeatureCard 
                            icon={<BrainCircuit className="w-6 h-6" />}
                            title="AI Strategist Co-Pilot"
                            desc="Not a chatbot — a strategic partner that guides, explains, teaches, and challenges you."
                        />
                        <FeatureCard 
                            icon={<Users className="w-6 h-6" />}
                            title="Deal-Maker’s Academy"
                            desc="Built-in cultural intelligence, negotiation strategy, and confidence-building tools."
                        />
                        <FeatureCard 
                            icon={<FileText className="w-6 h-6" />}
                            title="Partnership Toolkit"
                            desc="Instantly generates reports, outreach letters, policy briefs, and investment arguments."
                        />
                    </div>
                </div>
            </section>

            {/* --- AUDIENCE --- */}
            <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Who BW Nexus AI Is Built For</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AudienceCard title="Governments" desc="To attract investment, showcase hidden strengths, and unlock regional confidence." />
                        <AudienceCard title="Private Enterprise" desc="To enter new markets, find partners, diversify supply chains, and see hidden opportunities." />
                        <AudienceCard title="Financial Institutions" desc="To assess project viability, evaluate risk, and identify high-potential markets." />
                        <AudienceCard title="NGOs & Agencies" desc="To model social impact, understand regional potential, and support evidence-based programs." />
                        <AudienceCard title="Emerging Regions" desc="To finally compete on equal footing with major cities — with world-class intelligence." />
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 px-6 bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">How BW Nexus AI Works</h2>
                        <p className="text-slate-500 mt-2 font-mono uppercase text-xs tracking-widest">In Plain Terms</p>
                    </div>
                    
                    <div className="space-y-8">
                        <StepRow number="01" title="Understand who you are" desc="The system identifies your persona, objectives, location, role, and strategic context." />
                        <StepRow number="02" title="Reveal your real opportunities" desc="Maps your region, goals, assets, risks, and potential symbiotic partners globally." />
                        <StepRow number="03" title="Explore alternative pathways" desc="Generates multiple scenarios: 'your idea', 'stronger alternatives', and 'synergistic partnerships'." />
                        <StepRow number="04" title="Build your confidence" desc="A data-backed, structured, visual, transparent analysis is created for you." />
                        <StepRow number="05" title="Produce your Toolkit" desc="Instantly generates world-class intelligence reports, letters, and arguments to unlock meetings." />
                    </div>
                </div>
            </section>

            {/* --- COMPARISON TABLE (PROOF) --- */}
            <section className="py-24 px-6 bg-slate-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Proof That No One Has Built This Before</h2>
                        <p className="mt-4 text-slate-600">This is not an upgrade. It is a new category of intelligence technology.</p>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-white text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4 w-1/3">Capability</th>
                                    <th className="p-4 text-center opacity-70">Gov't Systems</th>
                                    <th className="p-4 text-center opacity-70">Banks</th>
                                    <th className="p-4 text-center opacity-70">Consulting Firms</th>
                                    <th className="p-4 text-center bg-slate-800 text-white">BW Nexus AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <ComparisonRow label="Symbiotic ecosystem analysis" nexus="✔ First in the world" />
                                <ComparisonRow label="Global matchmaking engine" nexus="✔ Yes" />
                                <ComparisonRow label="Alternative deal scans" firms="⚠ Only manually" nexus="✔ Automated" />
                                <ComparisonRow label="Cultural intelligence + negotiation" nexus="✔ Integrated" />
                                <ComparisonRow label="Multi-disciplinary fusion engine" nexus="✔ Breakthrough" />
                                <ComparisonRow label="Early-stage confidence builder" nexus="✔ Core design" />
                                <ComparisonRow label="Personalized partnership toolkit" firms="⚠ Template-based" nexus="✔ Custom, dynamic" />
                                <ComparisonRow label="Transparent math & economic models" nexus="✔ Fully integrated" />
                                <ComparisonRow label="Decision-stage batting order ranking" nexus="✔ Exclusive" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 px-6 bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Pricing – Simple, Transparent Access</h2>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                        <PricingCard 
                            title="7-Day Trial" 
                            price="$15" 
                            desc="Full access. Explore everything. Unlimited usage."
                            action={() => onEnter()}
                        />
                        <PricingCard 
                            title="3-Month Access" 
                            price="$175" 
                            desc="Quarterly subscription for sustained strategic planning."
                            action={() => onEnter()}
                        />
                        <PricingCard 
                            title="6-Month Access" 
                            price="$395" 
                            desc="Ideal for mid-term project development cycles."
                            recommended
                            action={() => onEnter()}
                        />
                        <PricingCard 
                            title="12-Month Access" 
                            price="$595" 
                            desc="Annual partnership. Maximum value for long-term growth."
                            action={() => onEnter()}
                        />
                    </div>
                </div>
            </section>

            {/* --- FINAL MESSAGE --- */}
            <section className="py-24 px-6 bg-slate-900 text-white text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <NexusLogo className="w-12 h-12 text-white mx-auto opacity-50" />
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                        BW Nexus AI was built to give the world something it has never had:
                    </h2>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        A way for every region — no matter its size, reputation, or location — to be seen, understood, and valued.
                    </p>
                    <p className="text-lg text-slate-400">
                        This is the first platform designed to remove the fear, reduce the risk, and build the confidence needed to create partnerships that change lives.
                    </p>
                    <div className="pt-8 border-t border-slate-800">
                        <p className="font-bold text-white uppercase tracking-widest text-sm">
                            Because the spark of understanding is where every great partnership begins.
                        </p>
                    </div>
                    <div className="pt-8">
                        <button 
                            onClick={onEnter}
                            className="px-10 py-4 bg-white text-slate-900 rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-colors shadow-xl"
                        >
                            Begin Your Journey
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-slate-950 text-center border-t border-slate-900">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} BW Global Advisory. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
        <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center mb-4 text-slate-900 shadow-sm">
            {icon}
        </div>
        <h4 className="font-bold text-slate-900 mb-2 text-sm">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

const AudienceCard = ({ title, desc }: any) => (
    <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <h4 className="font-bold text-lg text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600">{desc}</p>
    </div>
);

const StepRow = ({ number, title, desc }: any) => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
        <div className="text-3xl font-black text-slate-200">{number}</div>
        <div>
            <h4 className="text-lg font-bold text-slate-900">{title}</h4>
            <p className="text-slate-600 text-sm mt-1">{desc}</p>
        </div>
    </div>
);

const ComparisonRow = ({ label, firms, nexus }: any) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="p-4 font-medium text-slate-900 border-b border-slate-100">{label}</td>
        <td className="p-4 text-center text-slate-400 border-b border-slate-100 text-xs">❌</td>
        <td className="p-4 text-center text-slate-400 border-b border-slate-100 text-xs">❌</td>
        <td className="p-4 text-center text-slate-500 border-b border-slate-100 text-xs font-medium">{firms || '❌'}</td>
        <td className="p-4 text-center bg-slate-50 border-b border-slate-200 text-slate-900 font-bold text-xs border-l border-r border-slate-200">{nexus}</td>
    </tr>
);

const PricingCard = ({ title, price, desc, action, recommended }: any) => (
    <div className={`relative p-6 bg-white rounded-xl border flex flex-col ${recommended ? 'border-slate-900 shadow-lg ring-1 ring-slate-900' : 'border-slate-200 shadow-sm'}`}>
        {recommended && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Recommended
            </div>
        )}
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
        <div className="text-4xl font-bold text-slate-900 mb-4">{price}</div>
        <p className="text-xs text-slate-600 mb-6 flex-grow leading-relaxed">{desc}</p>
        <button 
            onClick={action}
            className={`w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${recommended ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >
            Select
        </button>
    </div>
);
