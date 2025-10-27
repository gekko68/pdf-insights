export interface PDFTextObject {
  str: string;
  bbox: {
    x: number;
    y: number;
    fontHeight?: number;
    width?: number;
    height?: number;
  };
}

export interface PDFImageObject {
  index: number;
  operatorIndex: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  transform: number[];
  op?: number; // Optional: PDF operator type for debugging
  name?: string; // Optional: image name from PDF resources
  dataUrl?: string; // Optional: base64 data URL of the image
}

export interface PDFPageObjects {
  texts: PDFTextObject[];
  images: PDFImageObject[];
}

export interface HighlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
  toJSON: () => object;
} 