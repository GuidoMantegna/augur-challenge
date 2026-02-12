const Header: React.FC = () => {
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
        <button className="btn btn-secondary btn-sm">⬇ Export</button>
        <button className="btn btn-primary btn-sm">+ Add Indicator</button>
      </div>
    </header>
  );
};

export default Header;
