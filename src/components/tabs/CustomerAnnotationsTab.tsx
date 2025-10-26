import React from 'react';

interface CustomerAnnotationsTabProps {
  pageNumber: number;
  selectedText: string;
  commentInput: string;
  setCommentInput: (v: string) => void;
  handleAddComment: (e: React.FormEvent) => void;
  handleFormMouseDown: () => void;
  handleFormMouseUp: () => void;
  commentsForPage: any[];
  handleDownloadComments: () => void;
  selectedCommentIndex: number | null;
  setSelectedCommentIndex: (i: number) => void;
  comments: any[];
  pendingOffsets: { start: number; end: number } | null;
  spanDebug: string[];
  commentInputRef: React.RefObject<HTMLInputElement | null>;
}

const CustomerAnnotationsTab: React.FC<CustomerAnnotationsTabProps> = ({
  pageNumber,
  selectedText,
  commentInput,
  setCommentInput,
  handleAddComment,
  handleFormMouseDown,
  handleFormMouseUp,
  commentsForPage,
  handleDownloadComments,
  selectedCommentIndex,
  setSelectedCommentIndex,
  comments,
  pendingOffsets,
  spanDebug,
  commentInputRef,
}) => (
  <div>
    <h3>Annotations for Page {pageNumber}</h3>
    {selectedText && (
      <form onSubmit={handleAddComment} onMouseDown={handleFormMouseDown} onMouseUp={handleFormMouseUp} style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#fff' }}>
          <b>Selected text (page {pageNumber}):</b>
          <div style={{ background: '#333', padding: 8, borderRadius: 4, marginTop: 4 }}>{selectedText}</div>
          <div style={{ color: '#bbb', fontSize: '0.9em' }}>Offsets: {pendingOffsets ? `${pendingOffsets.start} - ${pendingOffsets.end}` : 'N/A'}</div>
        </div>
        <input
          ref={commentInputRef}
          type="text"
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          placeholder="Enter your comment"
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #555', marginBottom: 8 }}
          required
        />
        <button type="submit" style={{ padding: '6px 16px', borderRadius: 4, background: '#61dafb', color: '#222', border: 'none', cursor: 'pointer' }}>
          Add Comment
        </button>
      </form>
    )}
    {commentsForPage.length > 0 && (
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleDownloadComments} style={{ padding: '6px 16px', borderRadius: 4, background: '#444', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Download Comments JSON
        </button>
      </div>
    )}
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {commentsForPage.length === 0 && <li style={{ color: '#bbb' }}>No comments yet for this page.</li>}
      {commentsForPage.map((c, i) => (
        <li
          key={i}
          style={{ background: selectedCommentIndex === i ? '#222a' : '#333', marginBottom: 8, padding: 8, borderRadius: 4, cursor: 'pointer', border: selectedCommentIndex === i ? '2px solid #61dafb' : 'none' }}
          onClick={() => setSelectedCommentIndex(i)}
        >
          <div style={{ fontSize: '0.95em', color: '#fff' }}><b>Page {c.page}</b></div>
          <div style={{ fontStyle: 'italic', color: '#eee', margin: '4px 0' }}>&ldquo;{c.text}&rdquo;</div>
          <div style={{ color: '#61dafb', marginBottom: 4 }}>{c.comment}</div>
          <div style={{ color: '#bbb', fontSize: '0.9em' }}>Offsets: {c.offsets ? `${c.offsets.start} - ${c.offsets.end}` : 'N/A'}</div>
          <div style={{ fontSize: '0.8em', color: '#aaa' }}>{new Date(c.timestamp).toLocaleString()}</div>
        </li>
      ))}
    </ul>
    {/* Debug info for troubleshooting */}
    <div style={{ marginTop: 16, fontSize: '0.8em', color: '#aaa', background: '#222', padding: 8, borderRadius: 4 }}>
      <b>Debug:</b>
      <div>All comments: {JSON.stringify(comments)}</div>
      <div>Comments for page {pageNumber}: {JSON.stringify(commentsForPage)}</div>
      <div>Selected comment index: {selectedCommentIndex}</div>
      <div>PDF text layer spans: {JSON.stringify(spanDebug)}</div>
    </div>
  </div>
);

export default CustomerAnnotationsTab; 