import { PDFPageObjects } from '../types/pdf';
import { ImageAnalysisResult, LLMConfig } from '../types/llm';

const STORAGE_KEYS = {
  IMAGES: 'pdf-insights-images',
  ANALYSES: 'pdf-insights-analyses',
  LLM_CONFIG: 'pdf-insights-llm-config',
  COMMENTS: 'pdf-insights-comments',
};

export class StorageService {
  /**
   * Save extracted images for a PDF file
   */
  static saveImages(pdfFileName: string, pageObjectsByPage: { [pageNum: number]: PDFPageObjects }): void {
    try {
      const key = `${STORAGE_KEYS.IMAGES}-${pdfFileName}`;
      localStorage.setItem(key, JSON.stringify(pageObjectsByPage));
      console.log(`Saved images for ${pdfFileName}`);
    } catch (error) {
      console.error('Failed to save images:', error);
      // If storage is full, try to clear old data
      this.clearOldData();
    }
  }

  /**
   * Load extracted images for a PDF file
   */
  static loadImages(pdfFileName: string): { [pageNum: number]: PDFPageObjects } | null {
    try {
      const key = `${STORAGE_KEYS.IMAGES}-${pdfFileName}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    }
    return null;
  }

  /**
   * Save LLM analysis results
   */
  static saveAnalyses(pdfFileName: string, analyses: ImageAnalysisResult[]): void {
    try {
      const key = `${STORAGE_KEYS.ANALYSES}-${pdfFileName}`;
      localStorage.setItem(key, JSON.stringify(analyses));
      console.log(`Saved ${analyses.length} analyses for ${pdfFileName}`);
    } catch (error) {
      console.error('Failed to save analyses:', error);
      this.clearOldData();
    }
  }

  /**
   * Load LLM analysis results
   */
  static loadAnalyses(pdfFileName: string): ImageAnalysisResult[] {
    try {
      const key = `${STORAGE_KEYS.ANALYSES}-${pdfFileName}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load analyses:', error);
    }
    return [];
  }

  /**
   * Save LLM configuration
   */
  static saveLLMConfig(config: LLMConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save LLM config:', error);
    }
  }

  /**
   * Load LLM configuration
   */
  static loadLLMConfig(): LLMConfig | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load LLM config:', error);
    }
    return null;
  }

  /**
   * Save comments/annotations
   */
  static saveComments(pdfFileName: string, comments: any[]): void {
    try {
      const key = `${STORAGE_KEYS.COMMENTS}-${pdfFileName}`;
      localStorage.setItem(key, JSON.stringify(comments));
    } catch (error) {
      console.error('Failed to save comments:', error);
      this.clearOldData();
    }
  }

  /**
   * Load comments/annotations
   */
  static loadComments(pdfFileName: string): any[] {
    try {
      const key = `${STORAGE_KEYS.COMMENTS}-${pdfFileName}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
    return [];
  }

  /**
   * Clear old data to free up space
   */
  private static clearOldData(): void {
    try {
      // Get all keys
      const keys = Object.keys(localStorage);

      // Find oldest entries (you could implement a timestamp-based system)
      const imageKeys = keys.filter(k => k.startsWith(STORAGE_KEYS.IMAGES));

      if (imageKeys.length > 5) {
        // Remove oldest entries if we have more than 5 PDFs cached
        const toRemove = imageKeys.slice(0, imageKeys.length - 5);
        toRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared ${toRemove.length} old image caches`);
      }
    } catch (error) {
      console.error('Failed to clear old data:', error);
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): { used: number; total: number; percentage: number } {
    let used = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }

    // Most browsers have ~5-10MB limit
    const total = 5 * 1024 * 1024; // 5MB estimate
    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  }

  /**
   * Clear all app data
   */
  static clearAllData(): void {
    try {
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(k =>
        k.startsWith('pdf-insights-')
      );
      appKeys.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${appKeys.length} storage entries`);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }
}
