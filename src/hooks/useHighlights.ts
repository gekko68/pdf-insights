import { useState } from 'react';

export function useHighlights() {
  const [highlightRects, setHighlightRects] = useState<DOMRect[]>([]);

  // computeHighlightRects: pass dependencies as arguments
  const computeHighlightRects = ({
    selectedCommentIndex,
    commentsForPage,
    setHighlightRects,
  }: {
    selectedCommentIndex: number | null;
    commentsForPage: any[];
    setHighlightRects: (rects: DOMRect[]) => void;
  }) => {
    setHighlightRects([]);
    if (
      selectedCommentIndex !== null &&
      commentsForPage[selectedCommentIndex] &&
      commentsForPage[selectedCommentIndex].offsets
    ) {
      const { start, end } = commentsForPage[selectedCommentIndex].offsets;
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      const pageContainer = document.querySelector('.react-pdf__Page');
      if (!textLayer || !pageContainer) return;
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
        if (!rangeStartNode && start >= spanStart && start <= spanEnd) {
          rangeStartNode = span.firstChild;
          rangeStartOffset = start - spanStart;
        }
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
  };

  // highlightSelectedObject: pass dependencies as arguments
  const highlightSelectedObject = async ({
    selectedObj,
    pageObjects,
    setHighlightRects,
    pdfData,
    pageNumber,
  }: {
    selectedObj: { type: 'text' | 'image'; index: number } | null;
    pageObjects: { texts: any[]; images: any[] };
    setHighlightRects: (rects: any[]) => void;
    pdfData: Uint8Array | null;
    pageNumber: number;
  }) => {
    if (!selectedObj) {
      setHighlightRects([]);
      return;
    }
    if (selectedObj.type === 'text') {
      const t = pageObjects.texts[selectedObj.index];
      if (!t || !t.str) {
        setHighlightRects([]);
        return;
      }
      const textLayer = document.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) {
        setHighlightRects([]);
        return;
      }
      const spans = Array.from(textLayer.querySelectorAll('span'));
      const normalize = (s: string) => (s || '').replace(/\s+/g, '').toLowerCase();
      const block = normalize(t.str);
      let found = false;
      for (let i = 0; i < spans.length; i++) {
        let acc = '';
        let spanIndices = [];
        for (let j = i; j < spans.length; j++) {
          acc += normalize((spans[j] as Element).textContent || '');
          spanIndices.push(j);
          if (acc === block) {
            const rects = spanIndices.map(idx => (spans[idx] as Element).getBoundingClientRect());
            const pageContainer = document.querySelector('.react-pdf__Page');
            if (pageContainer) {
              const pageRect = pageContainer.getBoundingClientRect();
              const minLeft = Math.min(...rects.map(r => r.left));
              const minTop = Math.min(...rects.map(r => r.top));
              const maxRight = Math.max(...rects.map(r => r.right));
              const maxBottom = Math.max(...rects.map(r => r.bottom));
              const bbox = {
                left: minLeft - pageRect.left,
                top: minTop - pageRect.top,
                width: maxRight - minLeft,
                height: maxBottom - minTop,
                right: maxRight - pageRect.left,
                bottom: maxBottom - pageRect.top,
                x: minLeft - pageRect.left,
                y: minTop - pageRect.top,
                toJSON: () => ({})
              };
              setHighlightRects([bbox]);
            }
            found = true;
            break;
          }
          if (acc.length > block.length) break;
        }
        if (found) break;
      }
      if (!found) {
        setHighlightRects([]);
      }
      return;
    }
    if (selectedObj.type === 'image') {
      const img = pageObjects.images[selectedObj.index];
      if (!img || !img.bbox) {
        setHighlightRects([]);
        return;
      }
      if (!pdfData) {
        setHighlightRects([]);
        return;
      }
      const pageContainer = document.querySelector('.react-pdf__Page');
      if (!pageContainer) {
        setHighlightRects([]);
        return;
      }
      const { pdfjs } = await import('react-pdf');
      const loadingTask = pdfjs.getDocument(pdfData.slice().buffer as ArrayBuffer);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });
      const pageRect = pageContainer.getBoundingClientRect();
      const pdfX = img.bbox.x;
      const pdfY = img.bbox.y;
      const pdfWidth = img.bbox.width;
      const pdfHeight = img.bbox.height;
      const viewportY = viewport.height - pdfY - pdfHeight;
      const scale = pageRect.width / viewport.width;
      const scaledX = pdfX * scale;
      const scaledY = viewportY * scale;
      const scaledWidth = pdfWidth * scale;
      const scaledHeight = pdfHeight * scale;
      const highlightRect = {
        left: scaledX,
        top: scaledY,
        width: scaledWidth,
        height: scaledHeight,
        right: scaledX + scaledWidth,
        bottom: scaledY + scaledHeight,
        x: scaledX,
        y: scaledY,
        toJSON: () => ({})
      };
      setHighlightRects([highlightRect]);
      return;
    }
  };

  return {
    highlightRects,
    setHighlightRects,
    computeHighlightRects,
    highlightSelectedObject,
  };
} 