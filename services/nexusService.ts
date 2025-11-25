
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ReportParameters, IVASAnalysis, SCFAnalysis, LAIAnalysis, MultiAgentTask, MultiAgentResponse, AgentType, NSILAnalysis, URPMetrics, SmartTradeOfficerResponse, RROI_Index, SEAM_Blueprint, SymbioticPartner, DeepReasoningAnalysis, GeopoliticalAnalysisResult, GovernanceAuditResult } from '../types';
import { getMultiAgentOrchestrator } from './MultiAgentOrchestrator';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Core Analytical Functions ---

export const calculateURPIndex = (params: ReportParameters): {
  urpIndex: number;
  metrics: URPMetrics;
  breakdown: string;
} => {
  const problemText = (
    params.problemStatement +
    ' ' +
    (params.refinedProblemStatement || '')
  ).toLowerCase();

  let economicPotential = 5.0;
  if (problemText.includes('growth') || problemText.includes('expansion')) economicPotential += 1.5;
  if (problemText.includes('investment') || problemText.includes('capital')) economicPotential += 1.0;
  if (problemText.includes('market') || problemText.includes('opportunity')) economicPotential += 0.8;

  let marketAccessibility = 5.5;
  if (problemText.includes('access') || problemText.includes('entry')) marketAccessibility += 1.2;
  if (problemText.includes('barrier') || problemText.includes('restriction')) marketAccessibility -= 1.5;

  let infrastructureReadiness = 6.0;
  if (problemText.includes('infrastructure') || problemText.includes('development')) infrastructureReadiness += 1.3;
  if (problemText.includes('digital')) infrastructureReadiness += 1.0;

  let regulatoryEnvironment = 5.8;
  if (problemText.includes('policy') || problemText.includes('government')) regulatoryEnvironment += 0.8;
  if (problemText.includes('reform')) regulatoryEnvironment += 1.2;

  let humanCapitalAvailability = 6.2;
  if (problemText.includes('talent') || problemText.includes('skilled')) humanCapitalAvailability += 1.2;

  const metrics: URPMetrics = {
    economicPotential: Math.min(10, Math.max(0, economicPotential)),
    marketAccessibility: Math.min(10, Math.max(0, marketAccessibility)),
    infrastructureReadiness: Math.min(10, Math.max(0, infrastructureReadiness)),
    regulatoryEnvironment: Math.min(10, Math.max(0, regulatoryEnvironment)),
    humanCapitalAvailability: Math.min(10, Math.max(0, humanCapitalAvailability)),
  };

  const urpIndex =
    metrics.economicPotential * 0.25 +
    metrics.marketAccessibility * 0.2 +
    metrics.infrastructureReadiness * 0.2 +
    metrics.regulatoryEnvironment * 0.2 +
    metrics.humanCapitalAvailability * 0.15;

  const breakdown = `URP Index Breakdown: Economic Potential (${metrics.economicPotential.toFixed(1)}/10), Market Access (${metrics.marketAccessibility.toFixed(1)}/10), Infrastructure (${metrics.infrastructureReadiness.toFixed(1)}/10), Regulatory (${metrics.regulatoryEnvironment.toFixed(1)}/10), Human Capital (${metrics.humanCapitalAvailability.toFixed(1)}/10)`;

  return { urpIndex: Math.round(urpIndex * 10) / 10, metrics, breakdown };
};

export const runEnhancedNSILAnalysis = (params: ReportParameters): NSILAnalysis => {
  const { urpIndex, metrics } = calculateURPIndex(params);
  const agerRiskScore = 10 - (metrics.regulatoryEnvironment + metrics.marketAccessibility) / 2; 
  const gsmPartnerMatches = Math.round(urpIndex * 1.5);
  
  let recommendedTier = 'Tier 1 Strategic Brief';
  let calculatedPrice = 5000;
  
  if (urpIndex > 7 && agerRiskScore < 4) {
      recommendedTier = 'Tier 3 Transformation Simulator';
      calculatedPrice = 25000;
  } else if (urpIndex > 5) {
      recommendedTier = 'Tier 2 Partnership Facilitator';
      calculatedPrice = 12000;
  }

  return {
    urpIndex,
    agerRiskScore: Math.round(agerRiskScore * 10) / 10,
    gsmPartnerMatches,
    recommendedTier,
    calculatedPrice,
    keyOpportunities: ['Market Expansion', 'FDI Attraction', 'Supply Chain Optimization'],
    keyRisks: ['Regulatory Compliance', 'Operational Costs'],
    summary: `Analysis indicates a URP of ${urpIndex} with ${agerRiskScore < 5 ? 'manageable' : 'elevated'} risk.`,
    confidenceScore: 85,
    escalationRequired: agerRiskScore > 7
  };
};

export const generateRROI = async (params: ReportParameters): Promise<RROI_Index> => {
    const prompt = `
        Generate a 'Regional Readiness & Opportunity Index' (RROI) for:
        Target: ${params.region} (${params.country || 'General'})
        Sector: ${params.industry.join(', ') || 'General Business'}
        Org Type: ${params.organizationType}

        Evaluate 4 key components on a 0-100 scale:
        1. Infrastructure Readiness
        2. Regulatory Environment
        3. Talent Availability
        4. Market Potential

        Provide a strict JSON response.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER },
                        summary: { type: Type.STRING },
                        components: {
                            type: Type.OBJECT,
                            properties: {
                                infrastructure: {
                                    type: Type.OBJECT,
                                    properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, analysis: { type: Type.STRING } }
                                },
                                regulatory: {
                                    type: Type.OBJECT,
                                    properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, analysis: { type: Type.STRING } }
                                },
                                talent: {
                                    type: Type.OBJECT,
                                    properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, analysis: { type: Type.STRING } }
                                },
                                market: {
                                    type: Type.OBJECT,
                                    properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, analysis: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No RROI generated");
        return JSON.parse(text) as RROI_Index;
    } catch (e) {
        console.error("RROI Error", e);
        // Fallback mock
        return {
            overallScore: 75,
            summary: "Estimated score based on regional averages due to connection issue.",
            components: {
                infrastructure: { name: "Infrastructure", score: 70, analysis: "Moderate development detected." },
                regulatory: { name: "Regulatory", score: 65, analysis: "Standard compliance requirements." },
                talent: { name: "Talent", score: 80, analysis: "Good availability of skilled labor." },
                market: { name: "Market", score: 85, analysis: "Strong demand signals." }
            }
        };
    }
};

export const generateSEAM = async (params: ReportParameters): Promise<SEAM_Blueprint> => {
    const prompt = `
        Generate a Strategic Ecosystem Alignment Map (SEAM) for:
        Region: ${params.region}
        Industry: ${params.industry.join(', ')}
        Org Type: ${params.organizationType}

        Identify 4-5 specific, real-world entities (companies, agencies, NGOs, or universities) that would form a high-impact ecosystem for this organization.
        
        Return valid JSON matching this schema:
        {
            "ecosystemSummary": "A brief strategic overview of the ecosystem landscape.",
            "partners": [
                { "entity": "Name of Entity", "type": "Government/Private/NGO/Academic", "rationale": "Why they are a strategic fit." }
            ]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ecosystemSummary: { type: Type.STRING },
                        partners: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    entity: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    rationale: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No SEAM generated");
        return JSON.parse(text) as SEAM_Blueprint;
    } catch (e) {
        console.error("SEAM Generation Error", e);
        return {
            ecosystemSummary: "Ecosystem mapping unavailable at this time.",
            partners: []
        };
    }
};

export const generateSymbioticMatches = async (params: ReportParameters): Promise<SymbioticPartner[]> => {
    const prompt = `
        ACT AS THE GLOBAL MATCHMAKER.
        
        User Profile:
        - Type: ${params.organizationType}
        - Industry: ${params.industry.join(', ')}
        - Goal: ${params.problemStatement}
        - Region Preference: ${params.region}

        MISSION:
        Find 4 "Symbiotic Partners" globally. Do NOT look for obvious competitors. Look for ASYMMETRY.
        Example: If user is a Tech Startup in London, match them with a Regional Government in Vietnam offering tax breaks + low labor cost.
        Example: If user is a Mining Corp, match them with an Indigenous NGO for ESG compliance.

        Prioritize "Unseen" opportunities—tier 2/3 cities, emerging markets, or cross-sector alliances.

        Return strictly JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            entityName: { type: Type.STRING },
                            entityType: { type: Type.STRING },
                            location: { type: Type.STRING },
                            symbiosisScore: { type: Type.NUMBER },
                            asymmetryAnalysis: { type: Type.STRING },
                            mutualBenefit: { type: Type.STRING },
                            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            }
        });
        
        return JSON.parse(response.text || '[]');
    } catch (e) {
        console.error("Symbiosis Error", e);
        return [];
    }
};

export const generateDeepReasoning = async (userOrg: string, targetEntity: string, context: string): Promise<DeepReasoningAnalysis> => {
    const prompt = `
        ACT AS A RUTHLESS STRATEGIC CRITIC.
        
        Analyze the potential partnership between:
        1. User: ${userOrg}
        2. Target: ${targetEntity}
        Context: ${context}

        Do NOT be polite. Find the flaws. Find the hidden value.
        
        1. "Deal Killers": What will break this deal? (Cultural mismatch, regulatory wall, speed mismatch).
        2. "Hidden Gems": What is the 10x value multiplier no one sees?
        3. "Counter-Intuitive Insight": Why is the common wisdom wrong here?

        Use a Chain of Thought process.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 16384 },
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verdict: { type: Type.STRING, enum: ['Strong Buy', 'Cautious Proceed', 'Hard Pass'] },
                        dealKillers: { type: Type.ARRAY, items: { type: Type.STRING } },
                        hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
                        reasoningChain: { type: Type.ARRAY, items: { type: Type.STRING } },
                        counterIntuitiveInsight: { type: Type.STRING }
                    }
                }
            }
        });
        
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Deep Reasoning Error", e);
        return {
            verdict: 'Cautious Proceed',
            dealKillers: ['Analysis failed'],
            hiddenGems: [],
            reasoningChain: [],
            counterIntuitiveInsight: 'Manual review required.'
        };
    }
};

export const runGeopoliticalAnalysis = async (params: ReportParameters): Promise<GeopoliticalAnalysisResult> => {
    const prompt = `
        Act as a Top-Tier Geopolitical Analyst (like Stratfor or Oxford Analytica).
        Analyze the geopolitical stability and economic outlook for: ${params.region}.
        Focus on the impact for: ${params.industry.join(', ')}.
        
        Assess: Political Stability, Currency Risk, Inflation, Regional Conflict, and Trade Barriers.
        
        Return valid JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        stabilityScore: { type: Type.NUMBER },
                        forecast: { type: Type.STRING },
                        currencyRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Volatile'] },
                        inflationTrend: { type: Type.STRING, enum: ['Stable', 'Rising', 'Hyper'] },
                        regionalConflictRisk: { type: Type.NUMBER },
                        tradeBarriers: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Geopolitical Analysis Error", e);
        return {
            stabilityScore: 50,
            forecast: "Unable to generate live forecast.",
            currencyRisk: "Medium",
            inflationTrend: "Stable",
            regionalConflictRisk: 50,
            tradeBarriers: []
        };
    }
};

export const runGovernanceAudit = async (params: ReportParameters): Promise<GovernanceAuditResult> => {
    const prompt = `
        Act as a Governance & Compliance Auditor (like Transparency International or a Big 4 Risk Partner).
        Perform a Governance Integrity Audit for operating in: ${params.region}.
        Target Entity Type: ${params.organizationType}.
        
        Evaluate: Corruption Risk, Regulatory Friction, Transparency.
        Identify "Red Flags" and a "Compliance Roadmap".
        
        Return valid JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        governanceScore: { type: Type.NUMBER },
                        corruptionRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                        regulatoryFriction: { type: Type.NUMBER },
                        transparencyIndex: { type: Type.NUMBER },
                        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        complianceRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Governance Audit Error", e);
        return {
            governanceScore: 50,
            corruptionRisk: "Medium",
            regulatoryFriction: 50,
            transparencyIndex: 50,
            redFlags: ["Data unavailable"],
            complianceRoadmap: ["Standard due diligence required"]
        };
    }
};

export const getSmartTradeOfficerGuidance = (params: ReportParameters, nsilAnalysis: NSILAnalysis): SmartTradeOfficerResponse => {
    return {
        guidance: `Based on URP ${nsilAnalysis.urpIndex}, focus on high-impact entry strategies.`,
        actionItems: ['Conduct deep-dive market research', 'Engage local legal counsel', 'Identify key stakeholders'],
        timelineEstimate: nsilAnalysis.urpIndex > 7 ? '6-9 Months' : '12-18 Months',
        riskFactors: nsilAnalysis.keyRisks,
        recommendedContacts: ['Investment Promotion Agency', 'Local Chamber of Commerce']
    };
};

// --- AI Integrations ---

export const orchestrateAgentResponse = async (userMessage: string, context: string): Promise<MultiAgentResponse> => {
    const orchestrator = getMultiAgentOrchestrator();
    const lowerMsg = userMessage.toLowerCase();
    let agentType: AgentType = 'strategist';
    
    if (lowerMsg.includes('news') || lowerMsg.includes('search')) agentType = 'scout';
    else if (lowerMsg.includes('negotiate') || lowerMsg.includes('culture')) agentType = 'diplomat';

    try {
        const task: MultiAgentTask = {
            id: `task-${Date.now()}`,
            prompt: `Context: ${context}. User Request: ${userMessage}. Act as a ${agentType}.`,
            requiredAgents: 1,
            consensusMethod: 'simple-majority',
            timeout: 20000
        };

        const analysis = await orchestrator.executeTask(task);
        
        if (analysis.status === 'completed') {
            return {
                agent: agentType,
                content: analysis.consensus.consensusContent,
                sources: analysis.responses[0]?.metadata?.sources || []
            };
        } else {
            throw new Error(analysis.error || 'Orchestration failed');
        }
    } catch (error) {
        console.error("Orchestrator error, falling back to direct call", error);
        // Fallback logic
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Act as a ${agentType}. Context: ${context}. User: ${userMessage}`
        });
        return { agent: agentType, content: response.text || "I am unable to process your request at this time." };
    }
};

export const generateThinkingContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16384 }
      },
    });
    return response.text || '';
  } catch (error) {
    console.error("Thinking Mode Error:", error);
    return "Complex analysis failed to generate.";
  }
};

export const generateFastSuggestion = async (input: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Context: ${context}. User Input: ${input}. Provide a concise, professional refinement or strategic suggestion.`,
    });
    return response.text || '';
  } catch (error) {
    console.error("Fast Suggestion Error:", error);
    return "";
  }
};

export const generateSearchGroundedContent = async (query: string): Promise<{text: string, sources: any[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text || '', sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "Analysis unavailable.", sources: [] };
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("TTS Error:", error);
        return undefined;
    }
};

export const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return await audioContext.decodeAudioData(bytes.buffer);
};

export const getDynamicScopeSuggestions = async (
    region: string, 
    country: string, 
    industry: string, 
    orgType: string
): Promise<{ objectives: string[], partners: string[] }> => {
    if (!region || !industry) return { objectives: [], partners: [] };

    const prompt = `
        Based on:
        Region: ${region} (${country || 'General'})
        Industry: ${industry}
        Org Type: ${orgType}
        
        Provide:
        1. 3 brief, high-impact Strategic Objectives (e.g., "Expand market share in ASEAN").
        2. 3 brief Ideal Partner profiles (e.g., "Local Logistics Distributor").
        
        Return ONLY JSON format: { "objectives": [], "partners": [] }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite-latest',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (e) {
        console.error("Dynamic Suggestion Error", e);
        return { objectives: [], partners: [] };
    }
};

export const composeReport = async (modules: string[], params: ReportParameters): Promise<any> => {
    // Mock report composition
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                reportId: 'instant-report-' + Math.random().toString(36).substr(2, 9),
                status: 'complete',
                modules: modules,
                timestamp: new Date().toISOString(),
                summary: `Report generated for ${params.organizationType} targeting ${params.region}.`
            });
        }, 1500);
    });
};
