import React from 'react';
import { useIndicators } from '../hooks/useIndicators';
import { useStats } from '../hooks/useStats';

const Dashboard: React.FC = () => {
  const {indicators, error, loading, severities} = useIndicators();
  const {stats, error: statsError, loading: statsLoading} = useStats();

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 28 28" fill="none">
            <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
            <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
          </svg>
          <span>Augur</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <a className="nav-item active" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
              <span className="nav-badge">3</span>
            </a>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Augur Events
            </a>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Investigate
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Intelligence</div>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Threat Indicators
            </a>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
              </svg>
              Campaigns
            </a>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Actors
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Reports</div>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              Executive Reports
            </a>
            <a className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Analytics
            </a>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>Threat Intelligence Dashboard</h1>
            <p>Real-time threat indicators and campaign intelligence</p>
          </div>
          <div className="page-header-actions">
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginRight: '8px' }}>
              <span className="status-dot live"></span> &nbsp;Live feed
            </span>
            <button className="btn btn-secondary btn-sm">⬇ Export</button>
            <button className="btn btn-primary btn-sm">+ Add Indicator</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <StatCard label="Total Indicators" value={stats.total} sub="↑ 12% from last week" type="total" icon />
          <StatCard label="Critical" value={stats.critical} sub="Requires immediate action" type="critical" />
          <StatCard label="High" value={stats.high} sub="Active monitoring" type="high" />
          <StatCard label="Medium" value={stats.medium} sub="Under review" type="medium" />
          <StatCard label="Low" value={stats.low} sub="Informational" type="low" />
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="input-with-icon" style={{ width: '260px' }}>
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="input" type="text" placeholder="Search indicators..." />
          </div>
          <div className="toolbar-divider"></div>
          <div className="toolbar-group">
            <select className="select">
              <option>All Severities</option>
              <option>Critical</option>
            </select>
            <select className="select">
              <option>All Types</option>
              <option>IP Address</option>
            </select>
            <select className="select">
              <option>All Sources</option>
              <option>AbuseIPDB</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-sm">Clear filters</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1 }}>
          <div className="content-area">
            <div className="data-table-wrapper" style={{ paddingTop: 'var(--sp-4)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '28px' }}><input type="checkbox" style={{ accentColor: 'var(--augur-blue)' }} /></th>
                    <th>Indicator <span className="sort-icon">↕</span></th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Confidence</th>
                    <th>Source</th>
                    <th>Tags</th>
                    <th>Last Seen <span className="sort-icon">↓</span></th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow 
                    indicator="185.220.101.34" 
                    type="⬡ IP" 
                    severity="Critical" 
                    confidence={94} 
                    source="AbuseIPDB" 
                    tags={['tor-exit', 'botnet']} 
                    time="2 min ago" 
                    selected 
                  />
                  {/* Additional rows would follow same pattern */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel */}
          <aside className="detail-panel" style={{ position: 'relative', flexShrink: 0 }}>
            <div className="detail-header">
              <h3>Indicator Details</h3>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '16px' }}>✕</button>
            </div>
            <div className="detail-body">
              <DetailSection label="Value" value="185.220.101.34" />
              <div className="detail-section">
                <div className="detail-section-label">Classification</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span className="badge badge-critical">Critical</span>
                  <span className="td-type">⬡ IP Address</span>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-section-label">Confidence Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <div className="confidence-bar" style={{ width: '120px', height: '6px' }}>
                    <div className="confidence-bar-fill" style={{ width: '94%', background: 'var(--severity-critical)' }}></div>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--severity-critical)' }}>94%</span>
                </div>
              </div>
              <div style={{ marginTop: 'var(--sp-6)', display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Investigate</button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }}>Block</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Sub-components for cleaner JSX
interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  type?: string;
  icon?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, sub, type, icon }) => (
  <div className={`stat-card ${type}`}>
    <div className="stat-card-header">
      <span className="stat-card-label">{label}</span>
      {icon && (
        <svg className="stat-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )}
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-sub">{sub}</div>
  </div>
);

interface TableRowProps {
  indicator: string;
  type: string;
  severity: string;
  confidence: number;
  source: string;
  tags: string[];
  time: string;
  selected: boolean;
}
const TableRow: React.FC<TableRowProps> = ({ indicator, type, severity, confidence, source, tags, time, selected }) => (
  <tr className={selected ? 'selected' : ''}>
    <td><input type="checkbox" defaultChecked={selected} style={{ accentColor: 'var(--augur-blue)' }} /></td>
    <td className="td-indicator">{indicator}</td>
    <td><span className="td-type">{type}</span></td>
    <td><span className={`badge badge-${severity.toLowerCase()}`}>{severity}</span></td>
    <td>
      <div className="td-confidence">
        <div className="confidence-bar">
          <div className="confidence-bar-fill" style={{ width: `${confidence}%`, background: `var(--severity-${severity.toLowerCase()})` }}></div>
        </div>
        <span className="confidence-value" style={{ color: `var(--severity-${severity.toLowerCase()})` }}>{confidence}</span>
      </div>
    </td>
    <td className="td-source">{source}</td>
    <td className="td-tags">
      {tags.map(tag => <span key={tag} className="tag tag-red">{tag}</span>)}
    </td>
    <td className="td-time">{time}</td>
  </tr>
);

interface DetailSectionProps {
  label: string;
  value: string;
}
const DetailSection: React.FC<DetailSectionProps> = ({ label, value }) => (
  <div className="detail-section">
    <div className="detail-section-label">{label}</div>
    <div className="detail-value">{value}</div>
  </div>
);

export default Dashboard;