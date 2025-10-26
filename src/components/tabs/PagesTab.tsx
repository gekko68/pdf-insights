import React from 'react';

interface PagesTabProps {
  numPages: number | undefined;
  pageNumber: number;
  setPageNumber: (n: number) => void;
  pageObjectsByPage: { [pageNum: number]: { texts: any[]; images: any[] } };
}

const PagesTab: React.FC<PagesTabProps> = ({ numPages, pageNumber, setPageNumber, pageObjectsByPage }) => {
  return !numPages ? (
    <div>No PDF loaded.</div>
  ) : (
    <div>
      <h3>Pages</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Array.from({ length: numPages }, (_, i) => {
          // Try to get the first non-empty text block for this page
          let pageTitle = '';
          if (pageObjectsByPage && pageObjectsByPage[i + 1]) {
            const firstText = (pageObjectsByPage[i + 1].texts || []).find(t => t.str && t.str.trim().length > 0);
            if (firstText) pageTitle = firstText.str.trim();
          }
          return (
            <li
              key={i + 1}
              style={{
                padding: '8px 12px',
                marginBottom: 4,
                borderRadius: 4,
                background: pageNumber === i + 1 ? '#61dafb' : '#333',
                color: pageNumber === i + 1 ? '#222' : '#fff',
                cursor: 'pointer',
                fontWeight: pageNumber === i + 1 ? 'bold' : undefined,
              }}
              onClick={() => setPageNumber(i + 1)}
            >
              Page {i + 1}
              {pageTitle && (
                <span style={{ color: '#888', marginLeft: 8, fontSize: '0.95em', fontStyle: 'italic', fontWeight: 'normal' }}>
                  {pageTitle.length > 40 ? pageTitle.slice(0, 40) + '…' : pageTitle}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PagesTab; 