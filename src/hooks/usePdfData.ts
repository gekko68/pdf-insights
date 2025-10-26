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

    // Enhanced image extraction with data URL generation
    const imageOps = [
      pdfjs.OPS.paintImageXObject,
      (pdfjs.OPS as any).paintJpegXObject,
      pdfjs.OPS.paintInlineImageXObject,
      pdfjs.OPS.paintXObject
    ].filter(Boolean);

    const opList = await page.getOperatorList();
    const images: PDFImageObject[] = [];
    let imageIndex = 0;

    // Track current transform matrix (CTM)
    const transformStack: number[][] = [[1, 0, 0, 1, 0, 0]]; // Identity matrix

    for (let i = 0; i < opList.fnArray.length; i++) {
      const op = opList.fnArray[i];
      const args = opList.argsArray[i];

      // Track transform/restore operations
      if (op === pdfjs.OPS.save) {
        transformStack.push([...transformStack[transformStack.length - 1]]);
      } else if (op === pdfjs.OPS.restore) {
        if (transformStack.length > 1) transformStack.pop();
      } else if (op === pdfjs.OPS.transform && Array.isArray(args) && args.length >= 6) {
        // Apply transform to current CTM
        const currentCTM = transformStack[transformStack.length - 1];
        const [a, b, c, d, e, f] = args;
        transformStack[transformStack.length - 1] = [
          a * currentCTM[0] + b * currentCTM[2],
          a * currentCTM[1] + b * currentCTM[3],
          c * currentCTM[0] + d * currentCTM[2],
          c * currentCTM[1] + d * currentCTM[3],
          e * currentCTM[0] + f * currentCTM[2] + currentCTM[4],
          e * currentCTM[1] + f * currentCTM[3] + currentCTM[5]
        ];
      }

      // Handle image operations
      if (imageOps.includes(op)) {
        console.log('Image op at', i, 'op:', op, 'args:', args);

        let x = 0, y = 0, width = 0, height = 0;
        let transform: number[] = [];
        let name: string | undefined = undefined;
        let dataUrl: string | undefined = undefined;

        // Get current transform from stack
        const currentCTM = transformStack[transformStack.length - 1];

        if (typeof args[0] === 'string') {
          // Case: first arg is image name
          name = args[0];

          // Try to extract the image data
          try {
            const resources = await page.objs;
            const xobjs = resources.get(name);
            if (xobjs) {
              console.log('Found image resource:', name, xobjs);
            }
          } catch (e) {
            console.log('Could not get image resource:', e);
          }

          // Use CTM for position
          transform = currentCTM;
          x = currentCTM[4];
          y = currentCTM[5];
          width = Math.abs(currentCTM[0]);
          height = Math.abs(currentCTM[3]);
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
          op,
          name,
          dataUrl
        } as PDFImageObject);
        imageIndex++;
      }
    }

    setPageObjects({ texts, images });
    setPageObjectsByPage(prev => ({ ...prev, [pageNumber]: { texts, images } }));

    // Log all objects found in the page
    console.log(`Page ${pageNumber} - Found ${texts.length} text objects and ${images.length} images`);
    console.log('Images:', images);
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