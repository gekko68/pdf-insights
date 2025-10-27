import React, { useState } from 'react';
import './LLMAnalysisModal.css';
import { LLMService } from '../services/llmService';
import { LLMConfig } from '../types/llm';

interface LLMAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string;
  imageName: string;
  llmConfig: LLMConfig;
}

const DEFAULT_PROMPTS = [
  'Describe this image in detail.',
  'What is the main subject of this image?',
  'Analyze the composition and visual elements of this image.',
  'Extract any text visible in this image.',
  'What are the key features or objects in this image?',
];

const LLMAnalysisModal: React.FC<LLMAnalysisModalProps> = ({
  isOpen,
  onClose,
  imageDataUrl,
  imageName,
  llmConfig,
}) => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPTS[0]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!llmConfig.apiKey && llmConfig.provider !== 'ollama') {
      setError('Please configure your API key in the settings (left sidebar)');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await LLMService.analyzeImage({
        imageDataUrl,
        prompt,
        provider: llmConfig.provider,
        model: llmConfig.model,
        apiKey: llmConfig.apiKey,
      });

      setResponse(result.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    alert('Response copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content llm-analysis-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🤖 Analyze Image with LLM</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Image Preview */}
          <div className="image-preview-section">
            <h3>{imageName}</h3>
            {imageDataUrl ? (
              <img src={imageDataUrl} alt={imageName} className="analysis-image-preview" />
            ) : (
              <div className="no-image-placeholder">
                <p>⚠️ Image data not available</p>
                <p className="hint">The image might not have been fully extracted from the PDF.</p>
              </div>
            )}
          </div>

          {/* LLM Configuration Display */}
          <div className="llm-config-display">
            <strong>Using:</strong> {llmConfig.provider} / {llmConfig.model}
            {!llmConfig.apiKey && llmConfig.provider !== 'ollama' && (
              <span className="warning-badge">⚠️ No API Key</span>
            )}
          </div>

          {/* Prompt Input */}
          <div className="prompt-section">
            <label htmlFor="prompt">Prompt:</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={4}
              disabled={loading}
            />

            {/* Quick Prompts */}
            <div className="quick-prompts">
              <label>Quick prompts:</label>
              <div className="quick-prompt-buttons">
                {DEFAULT_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="quick-prompt-btn"
                    disabled={loading}
                  >
                    {p.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim() || !imageDataUrl}
          >
            {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="response-section">
              <div className="response-header">
                <h3>Response:</h3>
                <button className="copy-btn" onClick={handleCopyResponse}>
                  📋 Copy
                </button>
              </div>
              <div className="response-content">
                {response}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LLMAnalysisModal;
