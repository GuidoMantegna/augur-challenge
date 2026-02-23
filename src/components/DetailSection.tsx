import { Indicator } from "../types/indicator";
import { timeAgoHM } from "../utils";

interface DetailSectionProps {
  details: Indicator | null;
  openDeleteModal: () => void;
}

const DetailSection: React.FC<DetailSectionProps> = ({ details, openDeleteModal }) => (
  <div className="detail-body">
    <div className="detail-section">
      <div className="detail-section-label">Value</div>
      <div className="detail-value">{details?.value}</div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Classification</div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <span className={`badge badge-${details?.severity}`}>
          {details?.severity}
        </span>
        <span className="td-type">{details?.type}</span>
      </div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Confidence Score</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "4px",
        }}
      >
        <div
          className="confidence-bar"
          style={{ width: "120px", height: "6px" }}
        >
          <div
            className="confidence-bar-fill"
            style={{
              width: `${details?.confidence}%`,
              background: `var(--severity-${details?.severity})`,
            }}
          ></div>
        </div>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: `var(--severity-${details?.severity})`,
          }}
        >
          {details?.confidence}%
        </span>
      </div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Tags</div>
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginTop: "4px",
        }}
      >
        {details?.tags?.map((tag) => (
          <span className={`tag tag-blue`} key={tag}>
            {tag}
          </span>
        ))}
        {/* <span className="tag tag-red">tor-exit</span>
        <span className="tag tag-red">botnet</span>
        <span className="tag tag-blue">scanner</span> */}
      </div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Timeline</div>
      <div className="detail-row">
        <span className="detail-row-label">First Seen</span>
        <span className="detail-row-value">{details?.firstSeen}</span>
      </div>
      <div className="detail-row">
        <span className="detail-row-label">Last Seen</span>
        <span className="detail-row-value">
          {timeAgoHM(details?.lastSeen || "")}
        </span>
      </div>
      <div className="detail-row">
        <span className="detail-row-label">Augured On</span>
        <span
          className="detail-row-value"
          style={{ color: "var(--augur-blue)" }}
        >
          2025-09-15
        </span>
      </div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Source</div>
      <div className="detail-row">
        <span className="detail-row-label">Provider</span>
        <span className="detail-row-value">{details?.source}</span>
      </div>
      <div className="detail-row">
        <span className="detail-row-label">Reports</span>
        <span className="detail-row-value">1,247</span>
      </div>
    </div>
    <div className="detail-section">
      <div className="detail-section-label">Related Campaigns</div>
      <div style={{ marginTop: "6px" }}>
        <a
          href="#"
          style={{
            color: "var(--augur-blue)",
            textDecoration: "none",
            fontSize: "12.5px",
            fontWeight: 500,
          }}
        >
          F5 Attack Campaign
        </a>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-tertiary)",
            marginLeft: "6px",
          }}
        >
          UNC3886 • China
        </span>
      </div>
    </div>
    <div style={{ marginTop: "var(--sp-6)", display: "flex", gap: "8px" }}>
      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
        Edit
      </button>
      <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={openDeleteModal}>
        Delete
      </button>
    </div>
  </div>
);

export default DetailSection;
