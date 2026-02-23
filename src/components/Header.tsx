import { apiRequest } from "../api/apiClient";
import { toast } from "react-toastify";

interface HeaderProps {
  openModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openModal }) => {
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
    toast("CSV file successfully downloaded", {
      type: "success",
      toastId: "csv",
    });
  };

  return (
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
        <button className="btn btn-primary btn-sm" onClick={openModal}>
          + Add Indicator
        </button>
      </div>
    </header>
  );
};

export default Header;
