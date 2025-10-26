import { LLMConfig, LLMResponse, ImageAnalysisRequest } from '../types/llm';

export class LLMService {
  /**
   * Analyze an image using the specified LLM provider
   */
  static async analyzeImage(request: ImageAnalysisRequest): Promise<LLMResponse> {
    const { provider, model, apiKey, imageDataUrl, prompt } = request;

    switch (provider) {
      case 'openai':
        return this.analyzeWithOpenAI(model, apiKey!, imageDataUrl, prompt);
      case 'anthropic':
        return this.analyzeWithAnthropic(model, apiKey!, imageDataUrl, prompt);
      case 'google':
        return this.analyzeWithGoogle(model, apiKey!, imageDataUrl, prompt);
      case 'ollama':
        return this.analyzeWithOllama(model, imageDataUrl, prompt);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * OpenAI API integration
   */
  private static async analyzeWithOpenAI(
    model: string,
    apiKey: string,
    imageDataUrl: string,
    prompt: string
  ): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }

  /**
   * Anthropic (Claude) API integration
   */
  private static async analyzeWithAnthropic(
    model: string,
    apiKey: string,
    imageDataUrl: string,
    prompt: string
  ): Promise<LLMResponse> {
    // Extract base64 data and media type
    const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid image data URL format');
    }
    const mediaType = matches[1];
    const base64Data = matches[2];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      model: data.model,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  /**
   * Google (Gemini) API integration
   */
  private static async analyzeWithGoogle(
    model: string,
    apiKey: string,
    imageDataUrl: string,
    prompt: string
  ): Promise<LLMResponse> {
    // Extract base64 data
    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      model,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  /**
   * Ollama (Local) API integration
   */
  private static async analyzeWithOllama(
    model: string,
    imageDataUrl: string,
    prompt: string,
    endpoint: string = 'http://localhost:11434'
  ): Promise<LLMResponse> {
    // Extract base64 data (remove data URL prefix)
    const base64Data = imageDataUrl.split(',')[1];

    const response = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        images: [base64Data],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.response,
      model: data.model,
    };
  }

  /**
   * Test API key validity for a provider
   */
  static async testApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      switch (provider) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          return openaiResponse.ok;

        case 'anthropic':
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 1,
              messages: [{ role: 'user', content: 'test' }],
            }),
          });
          return anthropicResponse.ok || anthropicResponse.status === 400; // 400 is ok, means key is valid

        case 'google':
          return true; // Simple check, will fail on first actual request if invalid

        case 'ollama':
          const ollamaResponse = await fetch('http://localhost:11434/api/tags');
          return ollamaResponse.ok;

        default:
          return false;
      }
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}
