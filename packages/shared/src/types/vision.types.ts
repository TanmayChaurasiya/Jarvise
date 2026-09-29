// ============================================================
// @jarvis/shared - Vision Types
// ============================================================

/** Screen region */
export interface ScreenRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** OCR result */
export interface OCRResult {
  text: string;
  blocks: OCRBlock[];
  confidence: number;
  language: string;
  processingTime: number;
}

export interface OCRBlock {
  text: string;
  bounds: ScreenRegion;
  confidence: number;
  type: 'paragraph' | 'line' | 'word';
}

/** UI element detection */
export interface UIElement {
  type: 'button' | 'input' | 'dropdown' | 'checkbox' | 'link' | 'menu' | 'tab' | 'unknown';
  label?: string;
  value?: string;
  bounds: ScreenRegion;
  isInteractive: boolean;
  state?: 'enabled' | 'disabled' | 'focused' | 'selected';
}

/** Screen understanding result */
export interface ScreenUnderstanding {
  application: string;
  windowTitle: string;
  description: string;
  uiElements: UIElement[];
  textContent: string;
  codeContent?: {
    language: string;
    code: string;
    errors?: Array<{
      line: number;
      message: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  };
  suggestions: string[];
  timestamp: number;
}

/** Vision analysis options */
export interface VisionAnalysisOptions {
  captureRegion?: ScreenRegion;
  performOCR: boolean;
  detectUI: boolean;
  detectCode: boolean;
  detectErrors: boolean;
  maxDetailLevel: 'low' | 'medium' | 'high';
}

/** Capture configuration */
export interface CaptureConfig {
  format: 'png' | 'jpeg';
  quality: number;
  scale: number;
  includeDevicePixelRatio: boolean;
}
