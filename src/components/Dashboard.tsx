import React, { useState } from "react";
// COMPONENTS
import {
  TableRow,
  Toolbar,
  Pagination,
  DetailSection,
  Sidebar,
  StatCard,
  Header,
} from ".";
import { ToastContainer } from "react-toastify";
// HOOKS
import { useStats, useFilters } from "../hooks";
// TYPES
import { Indicator } from "../types/indicator";

const Dashboard: React.FC = () => {
  const { stats, loading: statsLoading, fetchStats } = useStats();
  const {
    handleFilterChange,
    data,
    clearFilters,
    filters,
    handlePaginationChange,
    handleSorting,
    loading: indicatorsLoading,
    fetchFilters,
  } = useFilters();
  const [details, setDetails] = useState<Indicator | null>(null);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="app-layout">
        {/* SIDEBAR */}
        <Sidebar />
        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* PAGE HEADER */}
          <Header fetchFilters={fetchFilters} fetchStats={fetchStats} />
          {/* STATS */}
          <section className="stats-row">
            <StatCard
              label="Total Indicators"
              value={stats.total}
              sub="↑ 12% from last week"
              type="total"
              icon
              loading={statsLoading}
            />
            <StatCard
              label="Critical"
              value={stats.critical}
              sub="Requires immediate action"
              type="critical"
              loading={statsLoading}
            />
            <StatCard
              label="High"
              value={stats.high}
              sub="Active monitoring"
              type="high"
              loading={statsLoading}
            />
            <StatCard
              label="Medium"
              value={stats.medium}
              sub="Under review"
              type="medium"
              loading={statsLoading}
            />
            <StatCard
              label="Low"
              value={stats.low}
              sub="Informational"
              type="low"
              loading={statsLoading}
            />
          </section>
          {/* TOOLBAR */}
          <Toolbar
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            filters={filters}
          />
          {/* TABLE */}
          <div
            style={{
              display: "flex",
              flex: 1,
              overflowX: "scroll",
              position: "relative",
            }}
          >
            <div className="content-area">
              <div
                className="data-table-wrapper"
                style={{ paddingTop: "var(--sp-4)" }}
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "28px" }}>
                        <input
                          type="checkbox"
                          style={{ accentColor: "var(--augur-blue)" }}
                        />
                      </th>
                      <th onClick={handleSorting} aria-controls="sort">
                        Indicator <span className="sort-icon">↕</span>
                      </th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Confidence</th>
                      <th>Source</th>
                      <th>Tags</th>
                      <th>
                        Last Seen <span className="sort-icon">↓</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((row) => (
                      <tr
                        key={row.id}
                        className={details?.id === row.id ? "selected" : ""}
                        onClick={() => setDetails(row)}
                        data-testid="table-row"
                      >
                        <TableRow
                          {...row}
                          selected={details?.id === row.id}
                          loading={indicatorsLoading}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <Pagination
                handlePaginationChange={handlePaginationChange}
                data={data}
              />
            </div>

            {/* Detail Panel */}
            {details && (
              <aside className="detail-panel" style={{ flexShrink: 0 }}>
                <div className="detail-header">
                  <h3>Indicator Details</h3>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: "16px" }}
                    onClick={() => setDetails(null)}
                  >
                    ✕
                  </button>
                </div>
                <DetailSection details={details} />
              </aside>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
