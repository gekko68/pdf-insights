import React from 'react';

interface SidePanelProps {
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  PANEL_TABS: { key: string; label: string }[];
  renderPanelContent: () => React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({
  panelOpen,
  setPanelOpen,
  activeTab,
  setActiveTab,
  PANEL_TABS,
  renderPanelContent,
}) => (
  <div className={`side-panel ${panelOpen ? 'open' : 'closed'}`}> 
    <div className="side-panel-header">
      <span>Details</span>
      <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }} title="Close panel">×</button>
    </div>
    <div className="side-panel-tabs">
      {PANEL_TABS.map(tab => (
        <button
          key={tab.key}
          className={`side-panel-tab${activeTab === tab.key ? ' active' : ''}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div className="side-panel-content">
      {renderPanelContent()}
    </div>
  </div>
);

export default SidePanel; 