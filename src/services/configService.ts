import { LLMConfig } from '../types/llm';
import { HighlightConfig } from '../components/LeftSidebar';

export interface AppConfig {
  llm: LLMConfig;
  highlight: HighlightConfig;
  version: string;
  lastUpdated: string;
}

const DEFAULT_CONFIG: AppConfig = {
  llm: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: '',
  },
  highlight: {
    fillColor: '#ff0000',
    borderColor: '#b00000',
    opacity: 0.8,
  },
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

export class ConfigService {
  private static readonly STORAGE_KEY = 'pdf-insights-config';
  private static readonly CONFIG_FILE_NAME = 'pdf-insights-config.json';

  /**
   * Load configuration from localStorage
   */
  static loadConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        console.log('Loaded config from localStorage:', config);
        return { ...DEFAULT_CONFIG, ...config };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
    return DEFAULT_CONFIG;
  }

  /**
   * Save configuration to localStorage
   */
  static saveConfig(config: Partial<AppConfig>): void {
    try {
      const current = this.loadConfig();
      const updated: AppConfig = {
        ...current,
        ...config,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      console.log('Saved config to localStorage:', updated);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  /**
   * Update LLM configuration and save
   */
  static updateLLMConfig(llmConfig: LLMConfig): void {
    this.saveConfig({ llm: llmConfig });
  }

  /**
   * Update highlight configuration and save
   */
  static updateHighlightConfig(highlightConfig: HighlightConfig): void {
    this.saveConfig({ highlight: highlightConfig });
  }

  /**
   * Export configuration to a downloadable JSON file
   */
  static exportToFile(): void {
    try {
      const config = this.loadConfig();
      const json = JSON.stringify(config, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.CONFIG_FILE_NAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Exported config to file');
    } catch (error) {
      console.error('Failed to export config:', error);
    }
  }

  /**
   * Import configuration from a JSON file
   */
  static importFromFile(file: File): Promise<AppConfig> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const config = JSON.parse(content);

          // Validate the config structure
          if (!config.llm || !config.highlight) {
            throw new Error('Invalid config file format');
          }

          // Save the imported config
          this.saveConfig(config);
          console.log('Imported config from file:', config);
          resolve(config);
        } catch (error) {
          console.error('Failed to import config:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Auto-save config to file whenever it changes (download)
   * Note: Browser security prevents auto-write to specific location
   */
  static autoExportConfig(): void {
    // This would trigger a download - only use when user explicitly wants it
    this.exportToFile();
  }

  /**
   * Reset configuration to defaults
   */
  static resetConfig(): void {
    const resetConfig = {
      ...DEFAULT_CONFIG,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetConfig));
    console.log('Reset config to defaults');
  }

  /**
   * Get configuration as JSON string
   */
  static getConfigJSON(): string {
    const config = this.loadConfig();
    return JSON.stringify(config, null, 2);
  }

  /**
   * Watch for changes and provide callback
   */
  static watchConfig(callback: (config: AppConfig) => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        try {
          const config = JSON.parse(e.newValue);
          callback(config);
        } catch (error) {
          console.error('Failed to parse config change:', error);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}
