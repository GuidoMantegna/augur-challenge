interface ToolbarProps {
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const Toolbar: React.FC<ToolbarProps> = ({handleFilterChange}) => {
    return (
        <form className="toolbar">
          <div className="input-with-icon" style={{ width: '260px' }}>
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="input" type="text" placeholder="Search indicators..." onChange={handleFilterChange}/>
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
        </form>
    )
}

export default Toolbar