import React from "react";
import { Filters } from "../hooks/useFilters";
// @ts-ignore
import { sources } from "../../server/data";
import { Source } from "../types/indicator";
import { SELECT_OPTIONS } from "../utils";

interface ToolbarProps {
  handleFilterChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  clearFilters: () => void;
  filters: Filters;
}

const Toolbar: React.FC<ToolbarProps> = ({
  filters,
  handleFilterChange,
  clearFilters,
}) => {
  return (
    <form className="toolbar">
      <div className="input-with-icon" style={{ width: "260px" }}>
        <svg
          className="input-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="input"
          name="search"
          type="text"
          placeholder="Search indicators..."
          onChange={handleFilterChange}
          value={filters.search}
          data-testid="search-input"
        />
      </div>
      <div className="toolbar-divider"></div>
      <div className="toolbar-group">
        <select
          className="select"
          name="severity"
          onChange={handleFilterChange}
          value={filters.severity}
          data-testid="severity-select"
        >
          {["All Severities", ...SELECT_OPTIONS.severities].map((severity) => (
            <option key={severity} data-testid={`severity-option-${severity}`}>
              {severity}
            </option>
          ))}
        </select>
        <select
          className="select"
          name="type"
          onChange={handleFilterChange}
          value={filters.type}
          data-testid="types-select"
        >
          {["All Types", ...SELECT_OPTIONS.types].map((type) => (
            <option key={type} data-testid={`type-option-${type}`}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="select"
          name="source"
          onChange={handleFilterChange}
          value={filters.source}
          data-testid="sources-select"
        >
          {["All Sources", ...SELECT_OPTIONS.sources].map((source: Source) => (
            <option key={source} data-testid={`source-option-${source}`}>
              {source}
            </option>
          ))}
        </select>
      </div>
      <div className="toolbar-divider"></div>
      <select
        className="select"
        name="limit"
        onChange={handleFilterChange}
        value={filters.limit}
        data-testid="limit-select"
      >
        {["10", "20", "50", "100"].map((limit) => (
          <option
            key={limit}
            value={limit}
            data-testid={`limit-option-${limit}`}
          >
            {limit} rows
          </option>
        ))}
      </select>
      <div style={{ marginLeft: "auto" }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={clearFilters}
          type="button"
          data-testid="clear-filters-button"
        >
          Clear filters
        </button>
      </div>
    </form>
  );
};

export default Toolbar;
