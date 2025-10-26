// LLM Provider Interface
export interface LLMProvider {
  id: string;
  name: string;
  requiresApiKey: boolean;
  supportsVision: boolean;
  models: LLMModel[];
}

export interface LLMModel {
  id: string;
  name: string;
  supportsVision: boolean;
  maxTokens?: number;
}

export interface LLMConfig {
  provider: string;
  model: string;
  apiKey?: string;
  apiEndpoint?: string;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | LLMMessageContent[];
}

export interface LLMMessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageAnalysisRequest {
  imageDataUrl: string;
  prompt: string;
  provider: string;
  model: string;
  apiKey?: string;
}

export interface ImageAnalysisResult {
  imageIndex: number;
  pageNumber: number;
  analysis: string;
  timestamp: string;
  provider: string;
  model: string;
}

// Supported LLM Providers
export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    requiresApiKey: true,
    supportsVision: true,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', supportsVision: true, maxTokens: 4096 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', supportsVision: true, maxTokens: 4096 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', supportsVision: true, maxTokens: 4096 },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    requiresApiKey: true,
    supportsVision: true,
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', supportsVision: true, maxTokens: 8096 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', supportsVision: true, maxTokens: 4096 },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', supportsVision: true, maxTokens: 4096 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', supportsVision: true, maxTokens: 4096 },
    ],
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    requiresApiKey: true,
    supportsVision: true,
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', supportsVision: true, maxTokens: 8192 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', supportsVision: true, maxTokens: 8192 },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    requiresApiKey: false,
    supportsVision: true,
    models: [
      { id: 'llama3.2-vision', name: 'Llama 3.2 Vision', supportsVision: true },
      { id: 'llava', name: 'LLaVA', supportsVision: true },
      { id: 'bakllava', name: 'BakLLaVA', supportsVision: true },
    ],
  },
];
