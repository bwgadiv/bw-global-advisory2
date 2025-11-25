
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ReportParameters, DashboardIntelligence, AgentType, MultiAgentResponse, IVASAnalysis, SCFAnalysis, LAIAnalysis, MultiAgentTask } from '../types';
import { getMultiAgentOrchestrator } from './MultiAgentOrchestrator';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Legacy Support for UI ---
export const generateStrategicReport = async (params: ReportParameters): Promise<string> => {
  const prompt = `
    ACT AS A SENIOR STRATEGIC ANALYST for BW Global Advisory.
    CONTEXT: ${params.organizationType} in ${params.region} (${params.industry.join(', ')}).
    PROBLEM: ${params.problemStatement}
    
    REQUIREMENTS:
    - Tone: Professional, authoritative.
    - Format: Markdown.
    
    STRUCTURE:
    1. Executive Summary
    2. Market Landscape (${params.searchScope})
    3. Strategic Opportunities (Risk: ${params.riskTolerance})
    4. Ideal Partner Profile (${params.idealPartnerProfile})
    5. Actionable Roadmap (${params.expansionTimeline})
    
    Focus on: "${params.operationalPriority}".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text || "No intelligence generated.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return "## Analysis Failed\n\nUnable to generate intelligence. Please check system configuration.";
  }
};

export const fetchLiveInsights = async (topic: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find 3 recent strategic news items or market trends regarding: ${topic}. Return strictly a JSON array.`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
             responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    source: { type: Type.STRING },
                    summary: { type: Type.STRING },
                  },
                },
              },
        }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
      console.error("Live insights error", e);
      return [];
  }
};

// --- NEW INTELLIGENCE CAPABILITIES ---

export const fetchIntelligenceForCategory = async (category: string): Promise<DashboardIntelligence> => {
    const prompt = `
        You are a senior global intelligence analyst.
        Generate 3 critical, high-impact intelligence items for the category: "${category}".
        Focus on recent developments, geopolitical shifts, or major economic trends.
        
        For each item provide:
        - Company or Entity involved
        - Details of the event
        - Strategic Implication (Why it matters)
        - Source (Name of a credible news outlet)
        - URL (A plausible URL for the source)

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
                        category: { type: Type.STRING },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    company: { type: Type.STRING },
                                    details: { type: Type.STRING },
                                    implication: { type: Type.STRING },
                                    source: { type: Type.STRING },
                                    url: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No data returned");
        
        const data = JSON.parse(text);
        data.category = category; 
        return data as DashboardIntelligence;

    } catch (error) {
        console.error("Error fetching intelligence:", error);
        return {
            category,
            items: []
        };
    }
};

export const startReportGeneration = async (params: ReportParameters): Promise<string> => {
    console.log('Starting generation for:', params.reportName);
    return new Promise((resolve) => {
        setTimeout(() => resolve('job-' + Math.random().toString(36).substr(2, 9)), 1000);
    });
};

export const checkReportStatus = async (jobId: string): Promise<{ status: string; result?: string; error?: string }> => {
    return new Promise((resolve) => {
        const rand = Math.random();
        if (rand > 0.7) {
            resolve({ status: 'complete', result: 'Report generation successful. This is a mock result.' });
        } else if (rand < 0.1) {
            resolve({ status: 'failed', error: 'Mock generation error occurred.' });
        } else {
            resolve({ status: 'processing' });
        }
    });
};

export const generateAnalysisStream = async (item: any, region: string): Promise<ReadableStream> => {
    const prompt = `
        You are the Nexus AI Intelligence Engine.
        Conduct a deep-dive strategic analysis of the following opportunity in ${region}:
        
        Project: ${item.project_name}
        Details: ${item.summary}
        
        Output a report using the specialized NADL (Nexus Analysis Description Language) XML format.
    `;

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of response) {
                    if (chunk.text) {
                        controller.enqueue(encoder.encode(chunk.text));
                    }
                }
                controller.close();
            }
        });
    } catch (error) {
        console.error("Analysis Stream Error:", error);
        throw error;
    }
};

// --- UNPRECEDENTED ENGINES (IVAS, SCF, LAI, QUANTUM PATHWAYS) ---

export const calculateIVAS = async (region: string, industry: string, intent: string): Promise<IVASAnalysis> => {
    const prompt = `
        Analyze the 'Investment Velocity & Activation Score' (IVAS) for:
        Target: ${region}
        Sector: ${industry}
        Intent: ${intent}

        Consider regulatory friction, political will, and historical project timelines.
        Return JSON.
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
                        score: { type: Type.NUMBER },
                        activationVelocity: { type: Type.STRING },
                        regulatoryFriction: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                        politicalWill: { type: Type.NUMBER },
                        catalystEvent: { type: Type.STRING }
                    }
                }
            }
        });
        
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("IVAS Error", e);
        return { score: 0, activationVelocity: 'Unknown', regulatoryFriction: 'High', politicalWill: 0, catalystEvent: 'N/A' };
    }
};

export const runLAI = async (region: string): Promise<LAIAnalysis> => {
    const prompt = `
        Act as the Latent Asset Identifier. Scan ${region} for hidden economic assets and symbiotic pairings.
        What are the non-obvious opportunities?
        Return JSON.
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
                        latentAssets: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    asset: { type: Type.STRING },
                                    potential: { type: Type.STRING },
                                    symbiosis: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{"latentAssets": []}');
    } catch (e) {
        return { latentAssets: [] };
    }
};

export const simulateCascade = async (project: string, region: string): Promise<SCFAnalysis> => {
    const prompt = `
        Run a Symbiotic Cascade Forecast (SCF) for:
        Project: ${project}
        Region: ${region}
        
        Calculate job creation (direct/indirect), fiscal impact, and ecosystem ripple effects.
        Return JSON.
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
                        directJobs: { type: Type.NUMBER },
                        indirectJobs: { type: Type.NUMBER },
                        fiscalImpact: { type: Type.STRING },
                        ecosystemRipple: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { directJobs: 0, indirectJobs: 0, fiscalImpact: 'Unknown', ecosystemRipple: [] };
    }
};

export const generateQuantumStrategicPathways = async (params: ReportParameters): Promise<string> => {
    const prompt = `
        Act as the Nexus "Quantum Brain". 
        Your Mission: Solve the "100-Year Confidence Gap" for ${params.region}.
        
        Core Philosophy:
        Standard consulting firms fail because they apply old logic faster. 
        You must transcend human bias, historical habit, and risk aversion.
        
        The User: ${params.organizationType} (${params.userName}).
        The Target: ${params.targetPartner || 'Undecided Partner'} in ${params.industry.join(', ')}.
        The Goal: ${params.problemStatement}.

        Task:
        1. Identify the "Confidence Gap": What specific fear prevents global capital from flowing here?
        2. Reverse Engineer the Deal: Don't just match partners. Calculate the EXACT terms required.
        3. Find the "Unseen Angle": Identify a symbiotic opportunity no human consultant would see.
        4. Negotiate with the Future: Simulate the negotiation.

        Output a strategic narrative that compels action.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 16384 } 
            }
        });
        return response.text || "Quantum Pathway calculation incomplete.";
    } catch (error) {
        console.error("Quantum Pathway Error:", error);
        return "System unable to bridge the confidence gap at this time.";
    }
};

// --- GEMINI 2.0 INTEGRATIONS & MULTI-AGENT ORCHESTRATOR ---

export const scoutAgent = async (query: string): Promise<MultiAgentResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: { tools: [{googleSearch: {}}] },
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
            title: c.web?.title || 'Source',
            uri: c.web?.uri || ''
        })).filter((s: any) => s.uri) || [];
        
        return { agent: 'scout', content: response.text || "No data found.", sources };
    } catch (error) {
        console.error("Scout Error:", error);
        return { agent: 'scout', content: "I couldn't access the external network." };
    }
};

export const strategistAgent = async (query: string): Promise<MultiAgentResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: query,
            config: { thinkingConfig: { thinkingBudget: 16384 } }, 
        });
        return { agent: 'strategist', content: response.text || "Analysis incomplete." };
    } catch (error) {
        console.error("Strategist Error:", error);
        return { agent: 'strategist', content: "My strategic module is overloaded." };
    }
};

export const diplomatAgent = async (query: string): Promise<MultiAgentResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: `You are a master diplomat and negotiator. ${query}`,
        });
        return { agent: 'diplomat', content: response.text || "I cannot advise on this matter." };
    } catch (error) {
        console.error("Diplomat Error:", error);
        return { agent: 'diplomat', content: "Communication link failed." };
    }
};

export const orchestrateAgentResponse = async (userMessage: string, context: string): Promise<MultiAgentResponse> => {
    // Leverage the Multi-Agent Orchestrator for complex tasks
    const orchestrator = getMultiAgentOrchestrator();
    
    // Determine intent
    const lowerMsg = userMessage.toLowerCase();
    let agentType: AgentType = 'strategist';
    
    if (lowerMsg.includes('news') || lowerMsg.includes('search') || lowerMsg.includes('competitor')) {
        agentType = 'scout';
    } else if (lowerMsg.includes('culture') || lowerMsg.includes('negotiate') || lowerMsg.includes('email')) {
        agentType = 'diplomat';
    }

    try {
        // Create a task for the orchestrator
        const task: MultiAgentTask = {
            id: `task-${Date.now()}`,
            prompt: `Context: ${context}. User Request: ${userMessage}. Act as a ${agentType} and provide a detailed response.`,
            requiredAgents: agentType === 'strategist' ? 2 : 1, // Require consensus for strategy
            consensusMethod: 'confidence-weighted',
            timeout: 20000
        };

        const analysis = await orchestrator.executeTask(task);
        
        if (analysis.status === 'completed') {
            return {
                agent: agentType,
                content: analysis.consensus.consensusContent,
                // Extract sources if available in metadata
                sources: analysis.responses.find(r => r.metadata?.sources)?.metadata.sources
            };
        } else {
            throw new Error(analysis.error || 'Agent orchestration failed');
        }
    } catch (error) {
        console.warn("Orchestrator fallback initiated:", error);
        // Fallback to single agent direct call if orchestrator fails or is too slow
        if (agentType === 'scout') return await scoutAgent(userMessage);
        if (agentType === 'diplomat') return await diplomatAgent(userMessage);
        return await strategistAgent(userMessage);
    }
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

// --- UTILITIES ---

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

export const generateThinkingContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return response.text || '';
  } catch (error) {
    console.error("Thinking Mode Error:", error);
    return "Complex analysis failed to generate.";
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

export const composeReport = async (modules: string[], params: ReportParameters): Promise<any> => {
    console.log("Composing report with modules:", modules, "and params:", params);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                reportId: 'instant-report-' + Math.random().toString(36).substr(2, 9),
                status: 'complete',
                modules: modules,
                timestamp: new Date().toISOString(),
                summary: "Report generated successfully based on selected modules and tier."
            });
        }, 2000);
    });
};
