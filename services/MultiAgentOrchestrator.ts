
import type {
  AIAgentConfig,
  AgentResponse,
  ConsensusResult,
  MultiAgentTask,
  MultiAgentAnalysis,
  AgentHealthStatus,
  MultiAgentOrchestratorConfig,
  RegionProfile
} from '../types';
import { GoogleGenAI } from "@google/genai";
import { identifyLatentAssets } from './LAIWorker';
import { computeIVAS } from './IVAS';
import { runSCF } from './SCFEngine';

// Embedded Agent Implementation to avoid external dependencies in this demo
class BaseAgent {
  constructor(public config: AIAgentConfig) {}

  async executeTask(task: MultiAgentTask): Promise<any> {
    // Mock implementation for demo purposes
    return {
        content: `Analysis from ${this.config.provider} (${this.config.model}) on: ${task.prompt.substring(0, 50)}...`,
        confidence: 0.85,
        reasoning: "Based on available patterns and data analysis.",
        tokensUsed: 150,
        metadata: { source: this.config.provider }
    };
  }
}

class GoogleGeminiAgent extends BaseAgent {
  private ai: GoogleGenAI;
  
  constructor(config: AIAgentConfig) {
      super(config);
      this.ai = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async executeTask(task: MultiAgentTask): Promise<any> {
      // Real Gemini implementation
      try {
          const response = await this.ai.models.generateContent({
              model: this.config.model === 'gemini-pro' ? 'gemini-2.5-flash' : this.config.model, // Map legacy names
              contents: task.prompt,
          });
          return {
              content: response.text,
              confidence: 0.9,
              reasoning: "Generated via Gemini 2.5 Flash model",
              tokensUsed: 0,
              metadata: { source: 'Gemini API' }
          };
      } catch (e) {
          console.error("Gemini Agent Error", e);
          return super.executeTask(task); // Fallback
      }
  }
}

class OpenAIAgent extends BaseAgent {
    // Simulating OpenAI behavior
}

class AnthropicClaudeAgent extends BaseAgent {
    // Simulating Claude behavior
}

export class MultiAgentOrchestrator {
  private agents: Map<string, any> = new Map();
  private config: MultiAgentOrchestratorConfig;
  private activeTasks: Map<string, MultiAgentAnalysis> = new Map();
  private agentHealth: Map<string, AgentHealthStatus> = new Map();

  constructor(config: MultiAgentOrchestratorConfig) {
    this.config = config;
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // Initialize Google Gemini Agent
    if (process.env.API_KEY) {
      const geminiConfig: AIAgentConfig = {
        provider: 'google-gemini',
        model: 'gemini-2.5-flash',
        apiKey: process.env.API_KEY,
        temperature: 0.7,
        maxTokens: 4096,
        enabled: true,
        priority: 3,
        specializations: ['analysis', 'research', 'creative-writing'],
        rateLimits: { requestsPerMinute: 60, requestsPerHour: 1000 }
      };
      this.agents.set('gemini-pro', new GoogleGeminiAgent(geminiConfig));
    }

    // Initialize Virtual OpenAI Agent (Mock)
    const openaiConfig: AIAgentConfig = {
      provider: 'openai-gpt',
      model: 'gpt-4',
      apiKey: 'mock-key',
      temperature: 0.7,
      maxTokens: 4096,
      enabled: true,
      priority: 4,
      specializations: ['reasoning', 'data-analysis', 'validation'],
      rateLimits: { requestsPerMinute: 50, requestsPerHour: 200 }
    };
    this.agents.set('gpt-4', new OpenAIAgent(openaiConfig));
    

    // Initialize Virtual Claude Agent (Mock)
    const claudeConfig: AIAgentConfig = {
      provider: 'anthropic-claude',
      model: 'claude-3-sonnet-20240229',
      apiKey: 'mock-key',
      temperature: 0.7,
      maxTokens: 4096,
      enabled: true,
      priority: 4,
      specializations: ['ethical-analysis', 'safety-checks', 'long-form-content'],
      rateLimits: { requestsPerMinute: 50, requestsPerHour: 200 }
    };
    this.agents.set('claude-3', new AnthropicClaudeAgent(claudeConfig));
    

    // Initialize health monitoring for all agents
    for (const [agentId, agent] of this.agents) {
      this.agentHealth.set(agentId, {
        agentId,
        status: 'healthy',
        lastResponseTime: Date.now(),
        errorCount: 0,
        successRate: 1.0,
        rateLimitRemaining: 100,
        averageResponseTime: 0
      });
    }
  }

  async executeTask(task: MultiAgentTask): Promise<MultiAgentAnalysis> {
    const analysis: MultiAgentAnalysis = {
      task,
      responses: [],
      consensus: {} as ConsensusResult,
      status: 'processing',
      startTime: new Date().toISOString()
    };

    this.activeTasks.set(task.id, analysis);

    try {
      // Select agents for this task
      const selectedAgents = this.selectAgentsForTask(task);

      if (selectedAgents.length === 0) {
        throw new Error('No suitable agents available for this task');
      }

      // Execute task on selected agents in parallel
      const responsePromises = selectedAgents.map(async (agentId) => {
        const agent = this.agents.get(agentId);
        if (!agent) return null;

        try {
          const startTime = Date.now();
          const response = await agent.executeTask(task);
          const processingTime = Date.now() - startTime;

          // Update agent health
          this.updateAgentHealth(agentId, true, processingTime);

          return {
            agentId,
            provider: agent.config.provider,
            model: agent.config.model,
            content: response.content,
            confidence: response.confidence || 0.8,
            reasoning: response.reasoning || '',
            processingTime,
            tokensUsed: response.tokensUsed || 0,
            timestamp: new Date().toISOString(),
            metadata: response.metadata
          } as AgentResponse;
        } catch (error) {
          console.error(`Agent ${agentId} failed:`, error);
          this.updateAgentHealth(agentId, false, 0);
          return null;
        }
      });

      // Wait for all responses with timeout
      const responses = await Promise.race([
        Promise.all(responsePromises),
        new Promise<AgentResponse[]>((_, reject) =>
          setTimeout(() => reject(new Error('Task timeout')), task.timeout)
        )
      ]);

      // Filter out failed responses
      analysis.responses = responses.filter((r): r is AgentResponse => r !== null);

      if (analysis.responses.length === 0) {
        throw new Error('All agents failed to respond');
      }

      // Generate consensus
      analysis.consensus = await this.generateConsensus(analysis.responses, task);
      analysis.status = 'completed';
      analysis.endTime = new Date().toISOString();

    } catch (error) {
      analysis.status = 'failed';
      analysis.error = error instanceof Error ? error.message : 'Unknown error';
      analysis.endTime = new Date().toISOString();
    }

    this.activeTasks.set(task.id, analysis);
    return analysis;
  }

  private selectAgentsForTask(task: MultiAgentTask): string[] {
    const enabledAgents = Array.from(this.agents.keys()).filter(agentId => {
      const health = this.agentHealth.get(agentId);
      return health && health.status !== 'offline' && health.status !== 'unhealthy';
    });

    // Sort by priority and health
    const sortedAgents = enabledAgents.sort((a, b) => {
      const healthA = this.agentHealth.get(a)!;
      const healthB = this.agentHealth.get(b)!;
      const agentA = this.agents.get(a);
      const agentB = this.agents.get(b);

      // Primary sort: priority
      if (agentA.config.priority !== agentB.config.priority) {
        return agentB.config.priority - agentA.config.priority;
      }

      // Secondary sort: health status
      const healthScoreA = healthA.successRate * (1 - healthA.errorCount / 100);
      const healthScoreB = healthB.successRate * (1 - healthB.errorCount / 100);
      return healthScoreB - healthScoreA;
    });

    // Return top agents based on required count
    return sortedAgents.slice(0, Math.min(task.requiredAgents, sortedAgents.length));
  }

  private async generateConsensus(responses: AgentResponse[], task: MultiAgentTask): Promise<ConsensusResult> {
    const participatingAgents = responses.map(r => r.agentId);

    // Simple majority vote consensus
    if (responses.length === 1) {
      return {
        consensusContent: responses[0].content,
        confidence: responses[0].confidence,
        agreementLevel: 'unanimous',
        participatingAgents,
        dissentingOpinions: [],
        metadata: {
          totalAgents: 1,
          consensusMethod: task.consensusMethod,
          processingTime: responses[0].processingTime
        }
      };
    }

    // For multiple responses, use confidence-weighted consensus
    const totalConfidence = responses.reduce((sum, r) => sum + r.confidence, 0);
    
    // Use highest confidence response as primary consensus
    const primaryResponse = responses.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    const dissentingOpinions = responses
      .filter(r => r.agentId !== primaryResponse.agentId)
      .map(r => ({
        agentId: r.agentId,
        alternativeContent: r.content,
        reasoning: r.reasoning
      }));

    const agreementLevel = dissentingOpinions.length === 0 ? 'unanimous' :
                          dissentingOpinions.length < responses.length / 2 ? 'majority' : 'split';

    return {
      consensusContent: primaryResponse.content,
      confidence: totalConfidence / responses.length,
      agreementLevel,
      participatingAgents,
      dissentingOpinions,
      metadata: {
        totalAgents: responses.length,
        consensusMethod: task.consensusMethod,
        processingTime: responses.reduce((sum, r) => sum + r.processingTime, 0) / responses.length
      }
    };
  }

  private updateAgentHealth(agentId: string, success: boolean, responseTime: number): void {
    const health = this.agentHealth.get(agentId);
    if (!health) return;

    health.lastResponseTime = Date.now();

    if (success) {
      health.successRate = (health.successRate * 9 + 1) / 10; // Exponential moving average
      health.averageResponseTime = (health.averageResponseTime * 9 + responseTime) / 10;
    } else {
      health.errorCount++;
      health.successRate = (health.successRate * 9) / 10;
    }

    // Update status based on health metrics
    if (health.successRate < 0.5) {
      health.status = 'unhealthy';
    } else if (health.successRate < 0.8) {
      health.status = 'degraded';
    } else {
      health.status = 'healthy';
    }
  }

  getAgentHealth(): AgentHealthStatus[] {
    return Array.from(this.agentHealth.values());
  }

  getActiveTasks(): MultiAgentAnalysis[] {
    return Array.from(this.activeTasks.values());
  }

  getTaskStatus(taskId: string): MultiAgentAnalysis | undefined {
    return this.activeTasks.get(taskId);
  }

  updateConfig(newConfig: Partial<MultiAgentOrchestratorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getAvailableAgents(): AIAgentConfig[] {
    return Array.from(this.agents.values()).map(agent => agent.config);
  }
}

// Singleton instance
let orchestratorInstance: MultiAgentOrchestrator | null = null;

export function getMultiAgentOrchestrator(): MultiAgentOrchestrator {
  if (!orchestratorInstance) {
    const defaultConfig: MultiAgentOrchestratorConfig = {
      enabledAgents: ['gemini-pro', 'gpt-4', 'claude-3'],
      defaultConsensusMethod: 'confidence-weighted',
      minConsensusThreshold: 0.7,
      maxParallelTasks: 5,
      taskTimeout: 30000, // 30 seconds
      retryAttempts: 2,
      fallbackToSingleAgent: true
    };

    orchestratorInstance = new MultiAgentOrchestrator(defaultConfig);
  }

  return orchestratorInstance;
}

// --- Rocket Engine Orchestration ---

export type OrchResult = {
  nsilOutput: string; // structured NSIL block
  details: any;
};

/**
 * Orchestrate a simple pipeline:
 * 1) LAI candidates
 * 2) Compute IVAS for top candidate
 * 3) Run SCF on baseline investment
 */
export async function runOpportunityOrchestration(region: RegionProfile): Promise<OrchResult> {
  // Step 1: LAI
  const lais = identifyLatentAssets(region);
  const top = lais[0];
  
  if (!top) {
      // Fallback if no latent assets found
      return { 
          nsilOutput: '<nsil:error>No latent assets identified for this region profile.</nsil:error>', 
          details: { lais: [], ivas: null, scf: null } 
      };
  }

  // Step 2: IVAS (context extracted from region)
  const ivas = computeIVAS(top, { regionAmbition: 60, regulatoryFriction: 40 });
  
  // Step 3: SCF baseline (use IVAS activationMonths to estimate capital scale)
  const scfInput = { capitalInvestmentUSD: Math.max(1000000, top.marketEstimateUSD * 1000), localLaborShare: 0.5, supplyChainLocalMultiplier: 1.6, years: 5 };
  const scf = runSCF(scfInput);

  // Produce NSIL snippet
  const nsil = `
<nsil:latent_asset_identified id="${top.id}">
  <nsil:title>${top.title}</nsil:title>
  <nsil:description>${top.description}</nsil:description>
  <nsil:components>${top.components.join(', ')}</nsil:components>
  <nsil:market_estimate>${top.marketEstimateUSD}</nsil:market_estimate>
  <nsil:ivas_score>${ivas.ivasScore}</nsil:ivas_score>
  <nsil:activation_months>${ivas.activationMonths}</nsil:activation_months>
  <nsil:scf_total_impact>${scf.totalEconomicImpactUSD}</nsil:scf_total_impact>
</nsil:latent_asset_identified>
  `.trim();

  return { nsilOutput: nsil, details: { lais, ivas, scf } };
}

export default MultiAgentOrchestrator;
