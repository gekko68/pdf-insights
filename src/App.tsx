import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './App.css';
import ReactDOM from 'react-dom';
import PDFHighlightOverlay from './components/PDFHighlightOverlay';
import PageObjectsTab from './components/tabs/PageObjectsTab';
import MetadataTab from './components/tabs/MetadataTab';
import PagesTab from './components/tabs/PagesTab';
import CustomerAnnotationsTab from './components/tabs/CustomerAnnotationsTab';
import LLMAnnotationsTab from './components/tabs/LLMAnnotationsTab';
import SidePanel from './components/SidePanel';
import PDFViewer from './components/PDFViewer';
import { formatPdfDate } from './utils/pdfUtils';
import { usePdfData } from './hooks/usePdfData';
import { useHighlights } from './hooks/useHighlights';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PANEL_TABS = [
  { key: 'metadata', label: 'Metadata' },
  { key: 'pages', label: 'Pages' },
  { key: 'customer', label: 'Customer Annotations' },
  { key: 'llm', label: 'LLM Annotations' },
  { key: 'objects', label: 'Page Objects' },
];

function App() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('metadata');
  const [selectedText, setSelectedText] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(null);
  const [spanDebug ] = useState<string[]>([]);
  const [pendingOffsets, setPendingOffsets] = useState<{start: number, end: number} | null>(null);
  const lastSelection = useRef<string>('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const interactingWithForm = useRef<boolean>(false);
  const { highlightRects, setHighlightRects } = useHighlights();
  const [selectedObject, setSelectedObject] = useState<{ type: 'text' | 'image'; index: number } | null>(null);
  const [objectSubTab, setObjectSubTab] = React.useState<'text' | 'images'>('text');

  // Use the custom hook for all PDF data and objects
  const {
    pdfFile,
    setPdfFile,
    pdfData,
    setPdfData,
    numPages,
    pdfMeta,
    pageObjects,
    pageObjectsByPage,
    onDocumentLoadSuccess,
    extractPageObjects,
  } = usePdfData();

  // Use highlight logic from the hook
  const { computeHighlightRects, highlightSelectedObject } = useHighlights();

  // Call highlight after the PDF page is rendered
  const handlePageRenderSuccess = () => {
    computeHighlightRects({
      selectedCommentIndex,
      commentsForPage,
      setHighlightRects,
    });
  };

  useEffect(() => {
    setObjectSubTab('text');
  }, [pdfFile]);

  useEffect(() => {
    setPageNumber(1);
  }, [pdfFile]);

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => (prevPageNumber || 1) + offset);
    setSelectedText('');
    setCommentInput('');
    setSelectedCommentIndex(null);
    setPendingOffsets(null);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // When user selects text, compute and store absolute character offsets
  React.useEffect(() => {
    function handleTextSelection(e: MouseEvent) {
      const selection = window.getSelection();
      const activeElem = document.activeElement;
      if (selection && selection.toString().trim()) {
        const text = selection.toString();
        if (text !== lastSelection.current) {
          setSelectedText(text);
          setActiveTab('customer');
          setPanelOpen(true);
          setCommentInput('');
          lastSelection.current = text;

          // Compute absolute offsets
          const textLayer = document.querySelector('.react-pdf__Page__textContent');
          if (textLayer && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const spans = Array.from(textLayer.querySelectorAll('span'));
            const spanOffsets: {start: number, end: number}[] = [];
            let currOffset = 0;
            for (let i = 0; i < spans.length; i++) {
              const spanText = spans[i].textContent || '';
              spanOffsets.push({start: currOffset, end: currOffset + spanText.length});
              currOffset += spanText.length;
             
            }
            // Find start and end offsets
            let selStart = -1, selEnd = -1;
            for (let i = 0; i < spans.length; i++) {
              if (range.startContainer === spans[i].firstChild || spans[i].contains(range.startContainer)) {
                selStart = spanOffsets[i].start + range.startOffset;
              }
              if (range.endContainer === spans[i].firstChild || spans[i].contains(range.endContainer)) {
                selEnd = spanOffsets[i].start + range.endOffset;
              }
            }
            // Fallback: if selection covers multiple spans, use the first and last
            if (selStart === -1 || selEnd === -1) {
              let first = -1, last = -1;
              for (let i = 0; i < spans.length; i++) {
                if (range.intersectsNode(spans[i])) {
                  if (first === -1) first = i;
                  last = i;
                }
              }
              if (first !== -1 && last !== -1) {
                selStart = spanOffsets[first].start;
                selEnd = spanOffsets[last].end;
              }
            }
            if (selStart !== -1 && selEnd !== -1) {
              setPendingOffsets({start: selStart, end: selEnd});
            } else {
              setPendingOffsets(null);
            }
          } else {
            setPendingOffsets(null);
          }
        }
      } else {
        if (activeElem !== commentInputRef.current && !interactingWithForm.current) {
          setSelectedText('');
          setCommentInput('');
          lastSelection.current = '';
          setPendingOffsets(null);
        }
      }
    }
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [pageNumber]);

  // Track when user is interacting with the comment form
  function handleFormMouseDown() {
    interactingWithForm.current = true;
  }
  function handleFormMouseUp() {
    setTimeout(() => {
      interactingWithForm.current = false;
    }, 100);
  }

  // Add comment to state, store offsets
  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    const textToUse = lastSelection.current || selectedText;
    if (!textToUse || !commentInput || !pendingOffsets) return;
    setComments(prev => {
      const newComments = [
        ...prev,
        {
          text: textToUse,
          comment: commentInput,
          page: pageNumber,
          timestamp: new Date().toISOString(),
          offsets: pendingOffsets,
        },
      ];
      console.log('All comments after add:', newComments);
      return newComments;
    });
    setSelectedText('');
    setCommentInput('');
    lastSelection.current = '';
    setPendingOffsets(null);
  }

  // Download comments as JSON
  function handleDownloadComments() {
    const blob = new Blob([JSON.stringify(comments, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pdf-comments.json';
    a.click();
    URL.revokeObjectURL(url);
    // Do not clear anything after download
  }

  // Filter comments for the current page
  const commentsForPage = comments.filter(c => c.page === pageNumber);
  console.log('Current page:', pageNumber, 'Comments for page:', commentsForPage);

  // Ensure highlights update when a comment is selected or page changes
  React.useEffect(() => {
    if (activeTab === 'customer') {
      setHighlightRects([]); // Clear previous highlights
      if (selectedCommentIndex !== null && commentsForPage[selectedCommentIndex] && commentsForPage[selectedCommentIndex].offsets) {
        const { start, end } = commentsForPage[selectedCommentIndex].offsets;
        const textLayer = document.querySelector('.react-pdf__Page__textContent');
        const pageContainer = document.querySelector('.react-pdf__Page');
        if (textLayer && pageContainer) {
          const pageRect = pageContainer.getBoundingClientRect();
          const spans = Array.from(textLayer.querySelectorAll('span'));
          let currOffset = 0;
          let rangeStartNode: ChildNode | null = null, rangeStartOffset = 0;
          let rangeEndNode: ChildNode | null = null, rangeEndOffset = 0;
          for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            const spanText = span.textContent || '';
            const spanStart = currOffset;
            const spanEnd = currOffset + spanText.length;
            // Find start node/offset
            if (!rangeStartNode && start >= spanStart && start <= spanEnd) {
              rangeStartNode = span.firstChild;
              rangeStartOffset = start - spanStart;
            }
            // Find end node/offset
            if (!rangeEndNode && end >= spanStart && end <= spanEnd) {
              rangeEndNode = span.firstChild;
              rangeEndOffset = end - spanStart;
            }
            currOffset += spanText.length;
          }
          if (rangeStartNode && rangeEndNode) {
            const range = document.createRange();
            try {
              range.setStart(rangeStartNode, rangeStartOffset);
              range.setEnd(rangeEndNode, rangeEndOffset);
              const rects = Array.from(range.getClientRects());
              // Adjust rects to be relative to the PDF page container
              const adjustedRects = rects.map(rect => ({
                left: rect.left - pageRect.left,
                top: rect.top - pageRect.top,
                width: rect.width,
                height: rect.height,
                right: rect.right - pageRect.left,
                bottom: rect.bottom - pageRect.top,
                x: rect.left - pageRect.left,
                y: rect.top - pageRect.top,
                toJSON: () => ({})
              }));
              setHighlightRects(adjustedRects);
            } catch (e) {
              setHighlightRects([]);
            }
          }
        }
      }
    }
  }, [selectedCommentIndex, commentsForPage, pageNumber, activeTab, setHighlightRects]);

  // Call extractPageObjects on page change
  React.useEffect(() => {
    extractPageObjects(pageNumber);
  }, [pageNumber]);

  // Panel content for each tab
  function renderPanelContent() {
    switch (activeTab) {
      case 'metadata':
        return <MetadataTab pdfMeta={pdfMeta} />;
      case 'pages':
        return <PagesTab numPages={numPages} pageNumber={pageNumber} setPageNumber={setPageNumber} pageObjectsByPage={pageObjectsByPage} />;
      case 'customer':
        return (
          <CustomerAnnotationsTab
            pageNumber={pageNumber}
            selectedText={selectedText}
            commentInput={commentInput}
            setCommentInput={setCommentInput}
            handleAddComment={handleAddComment}
            handleFormMouseDown={handleFormMouseDown}
            handleFormMouseUp={handleFormMouseUp}
            commentsForPage={commentsForPage}
            handleDownloadComments={handleDownloadComments}
            selectedCommentIndex={selectedCommentIndex}
            setSelectedCommentIndex={setSelectedCommentIndex}
            comments={comments}
            pendingOffsets={pendingOffsets}
            spanDebug={spanDebug}
            commentInputRef={commentInputRef}
          />
        );
      case 'llm':
        return <LLMAnnotationsTab />;
      case 'objects':
        return (
          <PageObjectsTab
            pageObjects={pageObjects}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
            highlightSelectedObject={highlightSelectedObject}
            objectSubTab={objectSubTab}
            setObjectSubTab={setObjectSubTab}
            setHighlightRects={setHighlightRects}
            pdfData={pdfData}
            pageNumber={pageNumber}
          />
        );
      default:
        return null;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = function(ev) {
        if (ev.target && ev.target.result) {
          setPdfData(new Uint8Array(ev.target.result as ArrayBuffer));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      {/* Open panel button */}
      {!panelOpen && pdfData && (
        <button className="open-panel-btn" onClick={() => setPanelOpen(true)}>
          Open Panel
        </button>
      )}
      <SidePanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        PANEL_TABS={PANEL_TABS}
        renderPanelContent={renderPanelContent}
      />
      {/* Main content */}
      <div className={`main-content${panelOpen ? ' with-panel' : ''}`} style={{ transition: 'margin-right 0.3s' }}>
        <PDFViewer
          pdfFile={pdfFile}
          pdfData={pdfData}
          pageNumber={pageNumber}
          numPages={numPages}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          onPageChange={changePage}
          highlightRects={highlightRects}
          handlePageRenderSuccess={handlePageRenderSuccess}
          handleFileChange={handleFileChange}
        />
      </div>
      {/* Highlight style */}
      <style>{`
        .pdf-highlight {
          background: yellow !important;
          color: #222 !important;
          border-radius: 2px;
        }
        .pdf-precise-highlight {
          background: yellow !important;
          opacity: 0.5;
          pointer-events: none;
          position: absolute;
          z-index: 10;
          border-radius: 2px;
        }
        mark.pdf-highlight {
          background: yellow !important;
          color: #222 !important;
          border-radius: 2px;
          padding: 0;
        }
      `}</style>
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
  );
}

export default App;