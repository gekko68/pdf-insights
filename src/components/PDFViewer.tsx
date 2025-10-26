import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PDFHighlightOverlay from './PDFHighlightOverlay';
import ReactDOM from 'react-dom';

interface HighlightConfig {
  fillColor: string;
  borderColor: string;
  opacity: number;
}

interface PDFViewerProps {
  pdfFile: File | null;
  pdfData: Uint8Array | null;
  pageNumber: number;
  numPages: number | undefined;
  onDocumentLoadSuccess: (pdf: any) => void;
  onPageChange: (offset: number) => void;
  highlightRects: any[];
  handlePageRenderSuccess: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  highlightConfig?: HighlightConfig;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfFile,
  pdfData,
  pageNumber,
  numPages,
  onDocumentLoadSuccess,
  onPageChange,
  highlightRects,
  handlePageRenderSuccess,
  handleFileChange,
  highlightConfig,
}) => (
  <div className="App">
    <h1>PDF Viewer</h1>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {pdfData && (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<span>Loading PDF...</span>}
          error={<span>Failed to load PDF.</span>}
        >
          <Page pageNumber={pageNumber} onRenderSuccess={handlePageRenderSuccess} />
          {/* Render highlight overlays INSIDE the PDF page container */}
          {highlightRects.length > 0 && (
            (() => {
              const pageElem = document.querySelector('.react-pdf__Page');
              if (pageElem) {
                return ReactDOM.createPortal(
                  <PDFHighlightOverlay rects={highlightRects} config={highlightConfig} />, pageElem
                );
              }
              // Fallback: render as before (may be misaligned)
              return <PDFHighlightOverlay rects={highlightRects} config={highlightConfig} />;
            })()
          )}
        </Document>
      )}
    </div>
    {pdfData && (
      <div style={{ marginTop: 16 }}>
        <button onClick={() => onPageChange(-1)} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span style={{ margin: '0 12px' }}>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </span>
        <button onClick={() => onPageChange(1)} disabled={!!numPages && pageNumber >= numPages}>
          Next
        </button>
      </div>
    )}
  </div>
);

export default PDFViewer; 