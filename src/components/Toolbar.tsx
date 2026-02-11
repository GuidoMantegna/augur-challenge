import React from "react";
import { Filters, useFilters } from "../hooks/useFilters";

interface ToolbarProps {
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    clearFilters: () => void;
    filters: Filters;
}

const Toolbar: React.FC<ToolbarProps> = ({}) => {
    const { filters, handleFilterChange, clearFilters } = useFilters();
    
    return (
        <form className="toolbar">
          <div className="input-with-icon" style={{ width: '260px' }}>
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="input" name="search" type="text" placeholder="Search indicators..." onChange={handleFilterChange} value={filters.search}/>
          </div>
          <div className="toolbar-divider"></div>
          <div className="toolbar-group">
            <select className="select" name="severity" onChange={handleFilterChange} value={filters.severity}>
              <option>All Severities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select className="select" name="type" onChange={handleFilterChange} value={filters.type}>
              <option>All Types</option>
              <option>IP Address</option>
              <option>Domain</option>
              <option>File Hash</option>
              <option>URL</option>
            </select>
            <select className="select" name="source" onChange={handleFilterChange} value={filters.source}>
              <option>All Sources</option>
              <option>AbuseIPDB</option>
              <option>VirusTotal</option>
              <option>OTX AlienVault</option>
              <option>Emerging Threats</option>
              <option>Silent Push</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} type="button">Clear filters</button>
          </div>
        </form>
    )
}

export default Toolbar