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
  IndicatorForm,
  Modal,
} from ".";
import { ToastContainer } from "react-toastify";
// HOOKS
import { useStats, useFilters, useIndicators } from "../hooks";
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
  const [isOpen, setIsOpen] = useState<string | boolean>(false);
  const closeModal = () => {
    setIsOpen(false);
    if (isOpen) {
      fetchStats();
      fetchFilters();
      isOpen !== "add" && setDetails(null);
    }
  };
  const { form, updateForm, handleSubmit, setForm } = useIndicators(closeModal);

  return (
    <>
      {/* Toasts */}
      <ToastContainer theme="dark" />
      {/* MODAL */}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {(isOpen === "add" || isOpen === "edit" || isOpen === "delete") && (
          <>
            <div className="modal-header">
              <h2>
                {
                  {
                    add: "Add Indicator",
                    edit: "Edit Indicator",
                    delete: "Are you sure you want to delete this indicator?",
                  }[isOpen]
                }
              </h2>
            </div>
            <IndicatorForm
              form={form}
              updateForm={updateForm}
              handleSubmit={handleSubmit}
              closeModal={() => setIsOpen(false)}
              action={isOpen}
            />
          </>
        )}
      </Modal>
      <div className="app-layout">
        {/* SIDEBAR */}
        <Sidebar />
        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* PAGE HEADER */}
          <Header openModal={() => setIsOpen("add")} />
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
                    {data.data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No indicators found
                        </td>
                      </tr>
                    ) : (
                      data.data.map((row) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {data.totalPages > 0 && (
                <Pagination
                  handlePaginationChange={handlePaginationChange}
                  data={data}
                />
              )}
            </div>

            {/* Detail Panel */}
            <aside
              className={`
                detail-panel 
                ${!details ? "translate-x-[100%]" : "translate-x-0"}
                transition-transform duration-200 ease-in-out animate ease-in-out`}
            >
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
              <DetailSection
                details={details}
                openModal={setIsOpen}
                setForm={setForm}
              />
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
