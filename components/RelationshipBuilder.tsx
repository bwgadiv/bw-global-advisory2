
import React, { useState, useEffect } from 'react';
import { MessageSquareIcon, GlobeIcon, ClipboardIcon, HandshakeIcon, CheckCircleIcon, AlertTriangleIcon } from './Icons';

interface CommunicationTemplate {
  id: string;
  name: string;
  category: 'introduction' | 'follow-up' | 'negotiation' | 'problem-solving' | 'celebration';
  partnerType: string;
  formality: 'formal' | 'semi-formal' | 'casual';
  content: string;
  tips: string[];
}

interface CulturalPreparation {
  partnerType: string;
  keyPhrases: Array<{
    local: string;
    english: string;
    context: string;
  }>;
  meetingEtiquette: string[];
  giftGuidelines: string[];
  communicationDoDont: Array<{
    do: string;
    dont: string;
  }>;
}

interface RelationshipMilestone {
  id: string;
  title: string;
  description: string;
  timeline: string;
  completed: boolean;
  category: 'trust-building' | 'communication' | 'collaboration' | 'commitment';
}

interface RelationshipBuilderProps {
  partnerType?: string;
  partnerName?: string;
  onTemplateSelect?: (template: CommunicationTemplate) => void;
  onMilestoneUpdate?: (milestones: RelationshipMilestone[]) => void;
}

const RelationshipBuilder: React.FC<RelationshipBuilderProps> = ({
  partnerType = 'government',
  partnerName = 'Partner Organization',
  onTemplateSelect,
  onMilestoneUpdate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('introduction');
  const [selectedFormality, setSelectedFormality] = useState<string>('formal');
  const [milestones, setMilestones] = useState<RelationshipMilestone[]>([]);
  const [culturalPrep, setCulturalPrep] = useState<CulturalPreparation | null>(null);

  // Communication templates
  const templates: CommunicationTemplate[] = [
    {
      id: 'gov-intro-formal',
      name: 'Government Partnership Introduction',
      category: 'introduction',
      partnerType: 'government',
      formality: 'formal',
      content: `Dear [Minister/Director Name],

I am writing to express our strong interest in exploring partnership opportunities with [Government Agency Name] in the area of [specific area of collaboration].

Our organization has extensive experience in [relevant expertise] and we believe there is significant potential for mutually beneficial collaboration that could contribute to [national/regional development goals].

We would welcome the opportunity to discuss how our capabilities might support [specific government priorities or initiatives].

Thank you for considering this partnership opportunity. We look forward to the possibility of working together for the benefit of [country/region].

Best regards,
[Your Name]
[Your Position]
[Your Organization]`,
      tips: [
        'Research the specific government priorities and use them in your communication',
        'Be prepared to provide detailed information about your organization\'s track record',
        'Follow up with a formal letter if initial contact is via email',
        'Allow sufficient time for government processes and decision-making'
      ]
    },
    // ... (Other templates truncated for brevity, same logic applies)
  ];

  // Mock Cultural Data
  useEffect(() => {
    const culturalData: Record<string, CulturalPreparation> = {
      government: {
        partnerType: 'government',
        keyPhrases: [
          { local: 'Asante sana', english: 'Thank you very much', context: 'Formal thank you' },
          { local: 'Karibu', english: 'Welcome', context: 'Greeting visitors' }
        ],
        meetingEtiquette: [
          'Arrive 10-15 minutes early for meetings',
          'Dress formally - business suits are expected',
          'Wait to be seated until invited'
        ],
        giftGuidelines: [
          'Small, thoughtful gifts are acceptable but not expected',
          'Avoid expensive gifts that could be seen as bribery'
        ],
        communicationDoDont: [
          { do: 'Be patient and allow time for thorough discussion', dont: 'Rush decisions or show impatience' },
          { do: 'Show respect for hierarchy and formal processes', dont: 'Bypass official channels' }
        ]
      },
      // ... (Other types)
    };
    setCulturalPrep(culturalData[partnerType] || culturalData.government);
  }, [partnerType]);

  // Initialize relationship milestones
  useEffect(() => {
    const initialMilestones: RelationshipMilestone[] = [
      { id: 'initial-contact', title: 'Initial Contact Established', description: 'First meeting or communication with partner', timeline: 'Week 1', completed: false, category: 'communication' },
      { id: 'mutual-understanding', title: 'Mutual Understanding Achieved', description: 'Both parties understand goals', timeline: 'Week 2-3', completed: false, category: 'trust-building' },
      { id: 'joint-planning', title: 'Joint Planning Session', description: 'Collaborative planning', timeline: 'Month 1', completed: false, category: 'collaboration' }
    ];
    setMilestones(initialMilestones);
  }, [partnerName]);

  const filteredTemplates = templates.filter(t => t.partnerType === partnerType); // Simplified filter for demo

  const toggleMilestone = (id: string) => {
    const updatedMilestones = milestones.map(milestone =>
      milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
    );
    setMilestones(updatedMilestones);
    onMilestoneUpdate?.(updatedMilestones);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <HandshakeIcon className="w-6 h-6 text-slate-900" />
          Relationship Builder
        </h2>
        <p className="text-slate-500 mb-6">
          Tools and guidance for building strong, lasting relationships with {partnerName} ({partnerType})
        </p>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'communication', label: 'Communication', icon: MessageSquareIcon },
            { id: 'cultural', label: 'Cultural Prep', icon: GlobeIcon },
            { id: 'milestones', label: 'Milestones', icon: ClipboardIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-3 rounded-t-lg font-bold text-sm transition-colors flex items-center gap-2 border-t border-x ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Areas */}
        {selectedCategory === 'communication' && (
          <div className="space-y-6">
             <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm text-slate-600 italic">
                Select templates to draft professional correspondence tailored to {partnerType}.
             </div>
             {/* Template list simplified */}
             <div className="bg-white border border-slate-200 rounded p-4">
                <h4 className="font-bold text-slate-900 mb-2">Government Intro Template</h4>
                <pre className="text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-100">
                    {templates[0].content}
                </pre>
             </div>
          </div>
        )}

        {selectedCategory === 'cultural' && culturalPrep && (
          <div className="space-y-6">
             <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-600"/> Do's</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                        {culturalPrep.communicationDoDont.map((item, i) => <li key={i}>• {item.do}</li>)}
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><AlertTriangleIcon className="w-4 h-4 text-red-600"/> Don'ts</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                        {culturalPrep.communicationDoDont.map((item, i) => <li key={i}>• {item.dont}</li>)}
                    </ul>
                </div>
             </div>
          </div>
        )}

        {selectedCategory === 'milestones' && (
          <div className="space-y-4">
            {milestones.map(milestone => (
              <div key={milestone.id} className={`flex items-center gap-4 p-4 rounded border transition-all ${milestone.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors flex-shrink-0 border ${
                    milestone.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-slate-900 bg-white'
                  }`}
                >
                  {milestone.completed && <CheckCircleIcon className="w-4 h-4" />}
                </button>
                <div className="flex-1">
                    <h4 className={`font-bold text-sm ${milestone.completed ? 'text-emerald-900' : 'text-slate-900'}`}>{milestone.title}</h4>
                    <p className="text-xs text-slate-500">{milestone.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-400 border px-2 py-1 rounded">{milestone.timeline}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipBuilder;
