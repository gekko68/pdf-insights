import React from 'react';

interface HighlightConfig {
  fillColor: string;
  borderColor: string;
  opacity: number;
}

interface PDFHighlightOverlayProps {
  rects: DOMRect[];
  config?: HighlightConfig;
}

function PDFHighlightOverlay({ rects, config }: PDFHighlightOverlayProps) {
  const defaultConfig: HighlightConfig = {
    fillColor: '#ff0000',
    borderColor: '#b00000',
    opacity: 0.8,
  };

  const effectiveConfig = config || defaultConfig;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {rects.map((rect, i) => {
        const borderWidth = 2;
        return (
          <div
            key={i}
            className="pdf-precise-highlight"
            style={{
              position: 'absolute',
              left: rect.left - borderWidth,
              top: rect.top - borderWidth,
              width: rect.width + (borderWidth * 2),
              height: rect.height + (borderWidth * 2),
              background: effectiveConfig.fillColor,
              opacity: effectiveConfig.opacity,
              pointerEvents: 'none',
              zIndex: 9999,
              borderRadius: 3,
              border: `${borderWidth}px solid ${effectiveConfig.borderColor}`,
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
          />
        );
      })}
    </div>
  );
}

export default PDFHighlightOverlay; 