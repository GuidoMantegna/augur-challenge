import React, { useState } from "react";
import Modal from "./Modal";
import IndicatorForm from "./IndicatorForm";
import { apiRequest } from "../api/apiClient";
import { toast } from "react-toastify";

interface HeaderProps {
  fetchStats: () => void;
  fetchFilters: () => void;
}

const Header: React.FC<HeaderProps> = ({ fetchFilters, fetchStats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const clodeModal = (action: string) => {
    setIsOpen(false);
    if (action === "submit") {
      fetchStats();
      fetchFilters();
    }
  };

  const downloadCVS = async () => {
    const csv = await apiRequest({
      method: "get",
      url: "/api/indicators/csv",
      config: { responseType: "blob" },
      setLoading: () => {},
      setError: () => {},
    });
    const url = window.URL.createObjectURL(new Blob([csv]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "indicators.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast("CSV file successfully downloaded", { type: "success", toastId: "csv" });
  };

  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="modal-header">+ Add Indicator</h2>
        <IndicatorForm closeModal={clodeModal} />
      </Modal>
      <header className="page-header">
        <div className="page-header-left">
          <h1>Threat Intelligence Dashboard</h1>
          <p>Real-time threat indicators and campaign intelligence</p>
        </div>
        <div className="page-header-actions">
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-tertiary)",
              marginRight: "8px",
            }}
          >
            <span className="status-dot live"></span> &nbsp;Live feed
          </span>
          <button className="btn btn-secondary btn-sm" onClick={downloadCVS}>
            ⬇ Export
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsOpen(true)}
          >
            + Add Indicator
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
