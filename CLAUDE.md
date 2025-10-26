# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PDF Insights is a React + TypeScript application for analyzing PDF documents. It provides:
- Interactive PDF viewing with text selection and highlighting
- Multi-tab side panel for different analysis views
- Customer annotations (text selection with comments)
- Page object extraction (text blocks and images)
- PDF metadata inspection

Built with Create React App, react-pdf (using pdf.js), and React 19.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm start

# Run tests in watch mode
npm test

# Production build
npm run build
```

## Architecture

### Core State Management

The app uses React hooks for state management with two primary custom hooks:

- **usePdfData** ([src/hooks/usePdfData.ts](src/hooks/usePdfData.ts)): Manages PDF document state, metadata extraction, and page object extraction (text blocks and images from PDF operator streams)
- **useHighlights** ([src/hooks/useHighlights.ts](src/hooks/useHighlights.ts)): Handles DOM-based highlight rectangle calculations for both text selections and page objects

### Component Structure

Main app component: [src/App.tsx](src/App.tsx)
- Orchestrates all state and coordinates between PDF viewer and side panel
- Manages text selection via DOM Range API with absolute character offset tracking
- Handles annotation workflow (select text → add comment → store with page and offsets)

Key components:
- **PDFViewer** ([src/components/PDFViewer.tsx](src/components/PDFViewer.tsx)): Wraps react-pdf Document/Page components
- **SidePanel** ([src/components/SidePanel.tsx](src/components/SidePanel.tsx)): Tabbed interface container
- **PDFHighlightOverlay** ([src/components/PDFHighlightOverlay.tsx](src/components/PDFHighlightOverlay.tsx)): Renders yellow highlight rectangles over PDF canvas
- **Tab components** (src/components/tabs/): MetadataTab, PagesTab, CustomerAnnotationsTab, LLMAnnotationsTab, PageObjectsTab

### Types

- **pdf.ts** ([src/types/pdf.ts](src/types/pdf.ts)): Defines PDFTextObject, PDFImageObject, PDFPageObjects, and HighlightRect interfaces
- **comment.ts** ([src/types/comment.ts](src/types/comment.ts)): Defines Comment interface with text, comment, page, timestamp, and offsets

### Text Selection & Highlighting

The app uses a sophisticated approach to preserve and replay text selections:

1. **Capture**: When user selects text, calculate absolute character offsets by iterating through text layer spans
2. **Storage**: Comments store these offsets along with selected text, comment, page number, and timestamp
3. **Replay**: When viewing a comment, reconstruct DOM Range from stored offsets and use `getClientRects()` to calculate highlight positions
4. **Rendering**: Convert DOMRect positions to PDF page-relative coordinates for overlay rendering

All highlight calculations account for PDF page coordinate transformations (viewport scaling, Y-axis flipping).

### Page Object Extraction

Extracts structured data from PDF pages using pdf.js low-level APIs:
- **Text objects**: Via `getTextContent()` with transform matrices for positioning
- **Image objects**: Via `getOperatorList()` scanning for paint operators (paintImageXObject, paintJpegXObject, paintInlineImageXObject, paintXObject)

Objects are indexed per page in `pageObjectsByPage` state for navigation and inspection.

## PDF.js Integration

- Worker configured via CDN: `unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
- Uses both high-level (Document/Page) and low-level (getDocument, getPage, getTextContent, getOperatorList) APIs
- Coordinate system requires Y-axis flipping: `viewport.height - y - height`

## Testing

Tests use React Testing Library and Jest (configured via react-scripts). Key test file: [src/App.test.tsx](src/App.test.tsx)
