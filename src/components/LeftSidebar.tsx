import React, { useState, useRef } from 'react';
import './LeftSidebar.css';
import { LLM_PROVIDERS, LLMConfig } from '../types/llm';
import { ConfigService } from '../services/configService';

export interface HighlightConfig {
  fillColor: string;
  borderColor: string;
  opacity: number;
}

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  highlightConfig: HighlightConfig;
  onHighlightConfigChange: (config: HighlightConfig) => void;
  llmConfig: LLMConfig;
  onLLMConfigChange: (config: LLMConfig) => void;
  onConfigImported?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onToggle,
  highlightConfig,
  onHighlightConfigChange,
  llmConfig,
  onLLMConfigChange,
  onConfigImported,
}) => {
  const [activeSection, setActiveSection] = useState<string>('configuration');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportConfig = () => {
    ConfigService.exportToFile();
  };

  const handleImportConfig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const config = await ConfigService.importFromFile(file);
        onLLMConfigChange(config.llm);
        onHighlightConfigChange(config.highlight);
        if (onConfigImported) {
          onConfigImported();
        }
        alert('Configuration imported successfully!');
      } catch (error) {
        alert('Failed to import configuration: ' + (error as Error).message);
      }
    }
  };

  const handleColorChange = (field: 'fillColor' | 'borderColor', value: string) => {
    onHighlightConfigChange({
      ...highlightConfig,
      [field]: value,
    });
  };

  const handleOpacityChange = (value: number) => {
    onHighlightConfigChange({
      ...highlightConfig,
      opacity: value,
    });
  };

  const resetToDefaults = () => {
    onHighlightConfigChange({
      fillColor: '#ff0000',
      borderColor: '#b00000',
      opacity: 0.8,
    });
  };

  const presetColors = [
    { name: 'Red', fill: '#ff0000', border: '#b00000' },
    { name: 'Yellow', fill: '#ffff00', border: '#cccc00' },
    { name: 'Green', fill: '#00ff00', border: '#00cc00' },
    { name: 'Blue', fill: '#0099ff', border: '#0066cc' },
    { name: 'Purple', fill: '#cc66ff', border: '#9933cc' },
    { name: 'Orange', fill: '#ff9900', border: '#cc7700' },
  ];

  return (
    <>
      <div className={`left-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="left-sidebar-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onToggle} title="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="left-sidebar-content">
          {/* Configuration Section */}
          <div className="sidebar-section">
            <button
              className={`section-header ${activeSection === 'configuration' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'configuration' ? '' : 'configuration')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" />
              </svg>
              <span>Highlight Configuration</span>
              <svg
                className={`chevron ${activeSection === 'configuration' ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {activeSection === 'configuration' && (
              <div className="section-content">
                <div className="config-group">
                  <label className="config-label">Fill Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={highlightConfig.fillColor}
                      onChange={(e) => handleColorChange('fillColor', e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={highlightConfig.fillColor}
                      onChange={(e) => handleColorChange('fillColor', e.target.value)}
                      className="color-text-input"
                      placeholder="#ff0000"
                    />
                  </div>
                </div>

                <div className="config-group">
                  <label className="config-label">Border Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={highlightConfig.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={highlightConfig.borderColor}
                      onChange={(e) => handleColorChange('borderColor', e.target.value)}
                      className="color-text-input"
                      placeholder="#b00000"
                    />
                  </div>
                </div>

                <div className="config-group">
                  <label className="config-label">
                    Opacity
                    <span className="opacity-value">{Math.round(highlightConfig.opacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={highlightConfig.opacity}
                    onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                    className="opacity-slider"
                  />
                </div>

                <div className="config-group">
                  <label className="config-label">Preview</label>
                  <div
                    className="color-preview"
                    style={{
                      backgroundColor: highlightConfig.fillColor,
                      borderColor: highlightConfig.borderColor,
                      opacity: highlightConfig.opacity,
                    }}
                  >
                    Sample highlighted text
                  </div>
                </div>

                <div className="config-group">
                  <label className="config-label">Presets</label>
                  <div className="preset-colors">
                    {presetColors.map((preset) => (
                      <button
                        key={preset.name}
                        className="preset-color-btn"
                        title={preset.name}
                        onClick={() => {
                          handleColorChange('fillColor', preset.fill);
                          handleColorChange('borderColor', preset.border);
                        }}
                        style={{
                          backgroundColor: preset.fill,
                          borderColor: preset.border,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button className="reset-btn" onClick={resetToDefaults}>
                  Reset to Defaults
                </button>
              </div>
            )}
          </div>

          {/* LLM Configuration Section */}
          <div className="sidebar-section">
            <button
              className={`section-header ${activeSection === 'llm' ? 'active' : ''}`}
              onClick={() => setActiveSection(activeSection === 'llm' ? '' : 'llm')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" />
              </svg>
              <span>LLM Configuration</span>
              <svg
                className={`chevron ${activeSection === 'llm' ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {activeSection === 'llm' && (
              <div className="section-content">
                <div className="config-group">
                  <label className="config-label">Provider</label>
                  <select
                    value={llmConfig.provider}
                    onChange={(e) => {
                      const provider = LLM_PROVIDERS.find(p => p.id === e.target.value);
                      onLLMConfigChange({
                        ...llmConfig,
                        provider: e.target.value,
                        model: provider?.models[0]?.id || '',
                      });
                    }}
                    className="select-input"
                  >
                    {LLM_PROVIDERS.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="config-group">
                  <label className="config-label">Model</label>
                  <select
                    value={llmConfig.model}
                    onChange={(e) => onLLMConfigChange({ ...llmConfig, model: e.target.value })}
                    className="select-input"
                  >
                    {LLM_PROVIDERS.find(p => p.id === llmConfig.provider)?.models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {LLM_PROVIDERS.find(p => p.id === llmConfig.provider)?.requiresApiKey && (
                  <div className="config-group">
                    <label className="config-label">
                      API Key
                      <button
                        className="show-hide-btn"
                        onClick={() => setShowApiKey(!showApiKey)}
                        type="button"
                      >
                        {showApiKey ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </label>
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={llmConfig.apiKey || ''}
                      onChange={(e) => onLLMConfigChange({ ...llmConfig, apiKey: e.target.value })}
                      placeholder="Enter your API key"
                      className="color-text-input"
                    />
                    <div style={{ fontSize: '0.75rem', color: '#ffb300', marginTop: '4px' }}>
                      🔒 Stored locally in browser only
                    </div>
                  </div>
                )}

                {llmConfig.provider === 'ollama' && (
                  <div className="config-group">
                    <label className="config-label">Ollama Endpoint</label>
                    <input
                      type="text"
                      value={llmConfig.apiEndpoint || 'http://localhost:11434'}
                      onChange={(e) => onLLMConfigChange({ ...llmConfig, apiEndpoint: e.target.value })}
                      placeholder="http://localhost:11434"
                      className="color-text-input"
                    />
                  </div>
                )}

                <div className="config-group" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <label className="config-label">Configuration Backup</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="reset-btn"
                      onClick={handleExportConfig}
                      style={{ flex: 1 }}
                    >
                      📥 Export Config
                    </button>
                    <button
                      className="reset-btn"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ flex: 1 }}
                    >
                      📤 Import Config
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportConfig}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#ffb300', marginTop: '8px' }}>
                    💾 Save your API keys and settings to a JSON file
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Placeholder for future sections */}
          <div className="sidebar-section">
            <button className="section-header disabled">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Export Options</span>
              <span className="coming-soon">Coming Soon</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button className="left-sidebar-toggle" onClick={onToggle} title="Open settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" />
          </svg>
        </button>
      )}
    </>
  );
};

export default LeftSidebar;
