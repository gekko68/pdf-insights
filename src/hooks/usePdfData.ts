import { useState, useCallback, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { PDFPageObjects, PDFTextObject, PDFImageObject } from '../types/pdf';

export function usePdfData() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pdfMeta, setPdfMeta] = useState<any>(null);
  const [pageObjects, setPageObjects] = useState<PDFPageObjects>({ texts: [], images: [] });
  const [pageObjectsByPage, setPageObjectsByPage] = useState<{ [pageNum: number]: PDFPageObjects }>({});

  useEffect(() => {
    setPageObjects({ texts: [], images: [] });
    setPageObjectsByPage({});
  }, [pdfFile, pdfData]);

  const onDocumentLoadSuccess = useCallback(async (pdf: any) => {
    setNumPages(pdf.numPages);
    // Extract metadata
    try {
      const meta = await pdf.getMetadata();
      setPdfMeta({
        title: meta.info.Title,
        author: meta.info.Author,
        subject: meta.info.Subject,
        keywords: meta.info.Keywords,
        creator: meta.info.Creator,
        producer: meta.info.Producer,
        creationDate: meta.info.CreationDate,
        modDate: meta.info.ModDate,
        version: pdf.pdfInfo?.PDFFormatVersion,
        numPages: pdf.numPages,
        ...meta.info,
      });
    } catch (e) {
      setPdfMeta({ error: 'Could not extract metadata.' });
    }
  }, []);

  const extractPageObjects = useCallback(async (pageNumber: number) => {
    setPageObjects({ texts: [], images: [] });
    if (!pdfData) return;
    const loadingTask = pdfjs.getDocument(pdfData.slice().buffer as ArrayBuffer);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNumber);
    // Text blocks
    const textContent = await page.getTextContent();
    const texts: PDFTextObject[] = textContent.items.map((item: any) => ({
      str: item.str,
      bbox: item.transform ? {
        x: item.transform[4],
        y: item.transform[5],
        fontHeight: item.height,
      } : {
        x: 0,
        y: 0,
        fontHeight: undefined,
      },
    }));
    // Enhanced image detection: check for all common image operators
    const imageOps = [
      pdfjs.OPS.paintImageXObject,
      (pdfjs.OPS as any).paintJpegXObject,
      pdfjs.OPS.paintInlineImageXObject,
      pdfjs.OPS.paintXObject
    ].filter(Boolean);
    const opList = await page.getOperatorList();
    const images: PDFImageObject[] = [];
    let imageIndex = 0;
    for (let i = 0; i < opList.fnArray.length; i++) {
      if (imageOps.includes(opList.fnArray[i])) {
        console.log('Image op at', i, 'op:', opList.fnArray[i], 'args:', opList.argsArray[i]);
        const args = opList.argsArray[i];
        let x = 0, y = 0, width = 0, height = 0, transform: number[] = [];
        let name: string | undefined = undefined;
        if (typeof args[0] === 'string') {
          // Case: first arg is image name, use width/height if present
          name = args[0];
          width = args[1] || 0;
          height = args[2] || 0;
        } else if (Array.isArray(args[0]) && args[0].length >= 6) {
          // Case: first arg is transform array
          transform = args[0];
          x = transform[4];
          y = transform[5];
          width = Math.abs(transform[0]);
          height = Math.abs(transform[3]);
        }
        images.push({
          index: imageIndex,
          operatorIndex: i,
          bbox: { x, y, width, height },
          transform,
          op: opList.fnArray[i],
          name
        } as PDFImageObject);
        imageIndex++;
      }
    }
    setPageObjects({ texts, images });
    setPageObjectsByPage(prev => ({ ...prev, [pageNumber]: { texts, images } }));
    // Log all objects found in the page
    const objectsPage = {
      [`ObjectsPage(Page${pageNumber})`]: {
        texts,
        images,
      }
    };
    console.log(JSON.stringify(objectsPage, null, 2));
    // Debug: Log operator list and annotations
    console.log('Operator List (fnArray):', opList.fnArray);
    const annotations = await page.getAnnotations();
    console.log('Annotations:', annotations);
  }, [pdfData]);

  return {
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
  };
} 