import React from "react";
import { Filters } from "../hooks/useFilters";

interface ToolbarProps {
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    clearFilters: () => void;
    filters: Filters;
}

const Toolbar: React.FC<ToolbarProps> = ({filters, handleFilterChange, clearFilters}) => {

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
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="select" name="type" onChange={handleFilterChange} value={filters.type}>
              <option value="">All Types</option>
              <option value="ip">IP Address</option>
              <option value="domain">Domain</option>
              <option value="hash">File Hash</option>
              <option value="url">URL</option>
            </select>
            <select className="select" name="source" onChange={handleFilterChange} value={filters.source}>
              <option value="">All Sources</option>
              <option value="abuseipdb">AbuseIPDB</option>
              <option value="virustotal">VirusTotal</option>
              <option value="otx">OTX AlienVault</option>
              <option value="emergingthreats">Emerging Threats</option>
              <option value="silentpush">Silent Push</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} type="button">Clear filters</button>
          </div>
        </form>
    )
}

export default Toolbar