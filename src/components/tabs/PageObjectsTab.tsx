import React from 'react';
import { PDFPageObjects } from '../../types/pdf';

interface PageObjectsTabProps {
  pageObjects: PDFPageObjects;
  selectedObject: { type: 'text' | 'image'; index: number } | null;
  setSelectedObject: (obj: { type: 'text' | 'image'; index: number } | null) => void;
  highlightSelectedObject: (args: {
    selectedObj: { type: 'text' | 'image'; index: number } | null;
    pageObjects: PDFPageObjects;
    setHighlightRects: (rects: any[]) => void;
    pdfData: Uint8Array | null;
    pageNumber: number;
  }) => Promise<void>;
  objectSubTab: 'text' | 'images';
  setObjectSubTab: (tab: 'text' | 'images') => void;
  setHighlightRects: (rects: any[]) => void;
  pdfData: Uint8Array | null;
  pageNumber: number;
}

const PageObjectsTab: React.FC<PageObjectsTabProps> = ({
  pageObjects,
  selectedObject,
  setSelectedObject,
  highlightSelectedObject,
  objectSubTab,
  setObjectSubTab,
  setHighlightRects,
  pdfData,
  pageNumber,
}) => (
  <div>
    <h3>Objects on Page</h3>
    <div style={{ display: 'flex', marginBottom: 12 }}>
      <button
        style={{
          flex: 1,
          padding: '8px 0',
          background: objectSubTab === 'text' ? '#61dafb' : '#333',
          color: objectSubTab === 'text' ? '#222' : '#fff',
          border: 'none',
          borderRadius: '4px 0 0 4px',
          fontWeight: objectSubTab === 'text' ? 'bold' : undefined,
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 0.2s, color 0.2s',
        }}
        onClick={() => setObjectSubTab('text')}
      >
        Text
      </button>
      <button
        style={{
          flex: 1,
          padding: '8px 0',
          background: objectSubTab === 'images' ? '#61dafb' : '#333',
          color: objectSubTab === 'images' ? '#222' : '#fff',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          fontWeight: objectSubTab === 'images' ? 'bold' : undefined,
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 0.2s, color 0.2s',
        }}
        onClick={() => setObjectSubTab('images')}
      >
        Images
      </button>
    </div>
    {objectSubTab === 'text' && (
      <div style={{ marginBottom: 8 }}>
        <b>Text blocks:</b> {pageObjects.texts.length}
        <ul style={{ fontSize: '0.95em', color: '#fff', marginTop: 4, maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
          {pageObjects.texts
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t.str && t.str.trim().length > 0)
            .map(({ t, i }) => (
              <li
                key={i}
                style={{ marginBottom: 2, background: selectedObject?.type === 'text' && selectedObject?.index === i ? '#ff0' : undefined, color: selectedObject?.type === 'text' && selectedObject?.index === i ? '#222' : undefined, cursor: 'pointer' }}
                onClick={() => { 
                  setSelectedObject({ type: 'text', index: i });
                  setTimeout(() => {
                    highlightSelectedObject({
                      selectedObj: { type: 'text', index: i },
                      pageObjects,
                      setHighlightRects,
                      pdfData,
                      pageNumber,
                    });
                  }, 100);
                }}
              >
                {t.str.length > 60 ? t.str.slice(0, 60) + '…' : t.str}
              </li>
            ))}
        </ul>
        <style>{`
          ul::-webkit-scrollbar {
            width: 10px;
            background: #fff;
          }
          ul::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 8px;
          }
          ul::-webkit-scrollbar-track {
            background: #fff;
          }
          ul {
            scrollbar-color: #ccc #fff;
            scrollbar-width: thin;
          }
        `}</style>
      </div>
    )}
    {objectSubTab === 'images' && (
      <div>
        <b>Images:</b> {pageObjects.images.length}
        <div style={{ fontSize: '0.92em', color: '#ffb300', margin: '6px 0 10px 0' }}>
          <span style={{ fontWeight: 500 }}>Note:</span> Only images with known position can be highlighted. Some images may not be highlightable due to PDF encoding limitations.
        </div>
        <ul style={{ fontSize: '0.95em', color: '#fff', marginTop: 4 }}>
          {pageObjects.images.map((img, i) => {
            const hasPosition = img.bbox && img.bbox.width && img.bbox.height && (img.bbox.x !== 0 || img.bbox.y !== 0);
            return (
              <li
                key={i}
                style={{ background: selectedObject?.type === 'image' && selectedObject?.index === i ? '#ff0' : undefined, color: selectedObject?.type === 'image' && selectedObject?.index === i ? '#222' : undefined, cursor: hasPosition ? 'pointer' : 'not-allowed', opacity: hasPosition ? 1 : 0.6 }}
                onClick={hasPosition ? () => { 
                  setSelectedObject({ type: 'image', index: i });
                  setTimeout(() => {
                    highlightSelectedObject({
                      selectedObj: { type: 'image', index: i },
                      pageObjects,
                      setHighlightRects,
                      pdfData,
                      pageNumber,
                    });
                  }, 100);
                } : undefined}
              >
                Image #{i + 1} (op: {img.operatorIndex})
                {img.bbox && (
                  <div style={{ fontSize: '0.8em', color: '#aaa', marginTop: '2px' }}>
                    Pos: ({Math.round(img.bbox.x)}, {Math.round(img.bbox.y)}) 
                    Size: {Math.round(img.bbox.width)}×{Math.round(img.bbox.height)}
                    {!hasPosition && (
                      <span
                        style={{ color: 'red', marginLeft: 8, cursor: 'help', borderBottom: '1px dotted #ffb300' }}
                        title="This image cannot be highlighted because its position is not available in the PDF operator stream. This is a limitation of how some PDFs encode images."
                      >
                        ⚠️ No position
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
          {pageObjects.images.length === 0 && <li>No images found.</li>}
        </ul>
      </div>
    )}
  </div>
);

export default PageObjectsTab; 