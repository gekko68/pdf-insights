import React from 'react';
import './Toolbar.css';

export type ToolType = 'select' | 'comment' | 'sticky-note';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolChange }) => {
  return (
    <div className="toolbar">
      <button
        className={`toolbar-button ${activeTool === 'select' ? 'active' : ''}`}
        onClick={() => onToolChange('select')}
        title="Select Tool"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          <path d="M13 13l6 6" />
        </svg>
        <span>Select</span>
      </button>

      <button
        className={`toolbar-button ${activeTool === 'comment' ? 'active' : ''}`}
        onClick={() => onToolChange('comment')}
        title="Comment Tool"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Comment</span>
      </button>

      <button
        className={`toolbar-button ${activeTool === 'sticky-note' ? 'active' : ''}`}
        onClick={() => onToolChange('sticky-note')}
        title="Sticky Note Tool"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5z" />
          <polyline points="16 3 16 8 21 8" />
        </svg>
        <span>Sticky Note</span>
      </button>
    </div>
  );
};

export default Toolbar;
