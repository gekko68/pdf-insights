import React from 'react';

function PDFHighlightOverlay({ rects }: { rects: DOMRect[] }) {
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
        return (
          <div
            key={i}
            className="pdf-precise-highlight"
            style={{
              position: 'absolute',
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              background: 'red',
              opacity: 0.8,
              pointerEvents: 'none',
              zIndex: 9999,
              borderRadius: 2,
              border: '3px solid #b00',
              boxShadow: '0 0 8px rgba(0,0,0,0.8)',
            }}
          />
        );
      })}
    </div>
  );
}

export default PDFHighlightOverlay; 