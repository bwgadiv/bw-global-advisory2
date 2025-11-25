
import React, { useState, useEffect } from 'react';
import type { ReportParameters } from '../types';
import { HandshakeIcon, ShieldCheck, CheckCircle, AlertTriangleIcon, SearchIcon } from './Icons';

interface PartnerProfile {
  id: string;
  name: string;
  type: 'government' | 'ngo' | 'academic' | 'community' | 'business' | 'international';
  credibilityScore: number;
  trackRecord: Array<{
    project: string;
    outcome: 'success' | 'partial' | 'failure';
    year: number;
    description: string;
  }>;
  expertise: string[];
  culturalContext: {
    communicationStyle: string;
    decisionMaking: string;
    relationshipBuilding: string;
    conflictResolution: string;
  };
  riskFactors: Array<{
    category: string;
    level: 'low' | 'medium' | 'high';
    description: string;
  }>;
  contactInfo: {
    primary: string;
    backup?: string;
    preferredMethod: 'email' | 'phone' | 'in-person' | 'formal-letter';
  };
  lastUpdated: string;
}

interface PartnerIntelligenceDashboardProps {
  params: Partial<ReportParameters>;
  onPartnerSelect?: (partner: PartnerProfile) => void;
}

const PartnerIntelligenceDashboard: React.FC<PartnerIntelligenceDashboardProps> = ({
  params,
  onPartnerSelect
}) => {
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerProfile | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockPartners: PartnerProfile[] = [
      {
        id: 'gov-ministry-energy',
        name: 'Ministry of Energy - Kenya',
        type: 'government',
        credibilityScore: 87,
        trackRecord: [
          { project: 'Solar Farm Initiative', outcome: 'success', year: 2023, description: 'Successfully implemented 200MW solar capacity' },
          { project: 'Rural Electrification', outcome: 'success', year: 2022, description: 'Connected 50,000 households to grid' }
        ],
        expertise: ['Energy Policy', 'Infrastructure Development', 'Regulatory Framework'],
        culturalContext: {
          communicationStyle: 'Formal and hierarchical',
          decisionMaking: 'Consensus-based with ministerial approval',
          relationshipBuilding: 'Long-term partnerships valued',
          conflictResolution: 'Mediation through formal channels'
        },
        riskFactors: [
          { category: 'Political', level: 'medium', description: 'Government changes can affect commitments' },
          { category: 'Bureaucratic', level: 'low', description: 'Standard approval processes in place' }
        ],
        contactInfo: {
          primary: 'perm-sec@energy.go.ke',
          preferredMethod: 'formal-letter'
        },
        lastUpdated: '2024-11-15'
      },
      {
        id: 'ngo-green-development',
        name: 'Green Development Initiative',
        type: 'ngo',
        credibilityScore: 92,
        trackRecord: [
          { project: 'Community Solar Training', outcome: 'success', year: 2023, description: 'Trained 500 local technicians' },
          { project: 'Sustainable Agriculture', outcome: 'success', year: 2022, description: 'Implemented in 20 villages' }
        ],
        expertise: ['Community Development', 'Sustainable Energy', 'Capacity Building'],
        culturalContext: {
          communicationStyle: 'Collaborative and community-focused',
          decisionMaking: 'Participatory with community input',
          relationshipBuilding: 'Trust-based, long-term engagement',
          conflictResolution: 'Community mediation preferred'
        },
        riskFactors: [
          { category: 'Funding', level: 'medium', description: 'Dependent on donor funding cycles' },
          { category: 'Capacity', level: 'low', description: 'Strong local network and expertise' }
        ],
        contactInfo: {
          primary: 'director@gdi.org',
          backup: '+254-700-123456',
          preferredMethod: 'email'
        },
        lastUpdated: '2024-11-18'
      },
      {
        id: 'academic-tech-university',
        name: 'Technical University of Kenya',
        type: 'academic',
        credibilityScore: 89,
        trackRecord: [
          { project: 'Engineering Research Partnership', outcome: 'success', year: 2023, description: 'Joint research on renewable energy' },
          { project: 'Student Internship Program', outcome: 'success', year: 2022, description: 'Placed 200 students in industry' }
        ],
        expertise: ['Engineering Education', 'Research & Development', 'Technical Training'],
        culturalContext: {
          communicationStyle: 'Academic and evidence-based',
          decisionMaking: 'Committee-based with academic review',
          relationshipBuilding: 'Knowledge-sharing and collaboration',
          conflictResolution: 'Academic dispute resolution processes'
        },
        riskFactors: [
          { category: 'Academic Calendar', level: 'low', description: 'Semester-based availability' },
          { category: 'Funding', level: 'medium', description: 'Research grant dependencies' }
        ],
        contactInfo: {
          primary: 'research@tukenya.ac.ke',
          preferredMethod: 'email'
        },
        lastUpdated: '2024-11-12'
      }
    ];
    setPartners(mockPartners);
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getCredibilityColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="partner-intelligence-dashboard space-y-6 text-slate-900">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <HandshakeIcon className="w-6 h-6 text-slate-900" />
          Partner Intelligence Dashboard
        </h2>
        <p className="text-slate-500 mb-6">
          Comprehensive intelligence on potential partners across government, NGO, academic, and community sectors.
          Build confidence through verified track records, cultural insights, and risk assessments.
        </p>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search partners by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'government', 'ngo', 'academic', 'community', 'business', 'international'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
                  filterType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Partner Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map(partner => (
            <div
              key={partner.id}
              className="partner-card bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-slate-900 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedPartner(partner);
                onPartnerSelect?.(partner);
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{partner.name}</h3>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold border ${
                    partner.type === 'government' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    partner.type === 'ngo' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    partner.type === 'academic' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                    'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {partner.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getCredibilityColor(partner.credibilityScore)}`}>
                    {partner.credibilityScore}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Credibility</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-500 uppercase font-bold mb-2">Key Expertise</div>
                <div className="flex flex-wrap gap-1">
                  {partner.expertise.slice(0, 2).map(exp => (
                    <span key={exp} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 font-medium">
                      {exp}
                    </span>
                  ))}
                  {partner.expertise.length > 2 && (
                    <span className="text-xs text-slate-400 font-medium">+{partner.expertise.length - 2} more</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Recent Success</div>
                <div className="text-sm text-slate-900 font-medium flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {partner.trackRecord[0]?.project || 'No recent projects'}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-2 mt-2">
                <span className="flex items-center gap-1">
                    RISK: 
                    <span className={`font-bold uppercase ${getRiskColor(partner.riskFactors[0]?.level || 'low')}`}>
                        {partner.riskFactors[0]?.level || 'LOW'}
                    </span>
                </span>
                <span className="font-mono">{new Date(partner.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Partner View Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedPartner.name}</h3>
                  <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded uppercase tracking-wider mt-2 inline-block">
                    {selectedPartner.type} Partner
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="text-slate-400 hover:text-slate-900 text-3xl leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Credibility Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-slate-200 text-center">
                  <div className={`text-3xl font-extrabold ${getCredibilityColor(selectedPartner.credibilityScore)}`}>
                    {selectedPartner.credibilityScore}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold mt-1">Credibility Score</div>
                </div>
                <div className="bg-white p-4 rounded border border-slate-200 text-center">
                  <div className="text-3xl font-extrabold text-blue-800">
                    {selectedPartner.trackRecord.length}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold mt-1">Projects Completed</div>
                </div>
                <div className="bg-white p-4 rounded border border-slate-200 text-center">
                  <div className="text-3xl font-extrabold text-slate-800">
                    {selectedPartner.expertise.length}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold mt-1">Expertise Areas</div>
                </div>
              </div>

              {/* Track Record */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Track Record
                </h4>
                <div className="space-y-3">
                  {selectedPartner.trackRecord.map((record, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded hover:bg-white transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-slate-900">{record.project}</h5>
                        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                          record.outcome === 'success' ? 'bg-emerald-100 text-emerald-800' :
                          record.outcome === 'partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.outcome}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{record.description}</p>
                      <div className="text-xs text-slate-400 mt-2 font-mono">{record.year}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangleIcon className="w-5 h-5" /> Risk Assessment
                </h4>
                <div className="space-y-3">
                  {selectedPartner.riskFactors.map((risk, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-slate-900">{risk.category} Risk</h5>
                        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                            risk.level === 'low' ? 'bg-emerald-100 text-emerald-800' : 
                            risk.level === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {risk.level}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <HandshakeIcon className="w-5 h-5 text-blue-400" /> Contact Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Primary Contact</span>
                    <span className="font-mono font-bold">{selectedPartner.contactInfo.primary}</span>
                  </div>
                  {selectedPartner.contactInfo.backup && (
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                      <span className="text-slate-400">Backup Contact</span>
                      <span className="font-mono font-bold">{selectedPartner.contactInfo.backup}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Preferred Method</span>
                    <span className="font-bold text-blue-400 uppercase tracking-wide">{selectedPartner.contactInfo.preferredMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerIntelligenceDashboard;
