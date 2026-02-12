interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  type?: string;
  icon?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  type,
  icon,
}) => (
  <div className={`stat-card ${type}`}>
    <div className="stat-card-header">
      <span className="stat-card-label">{label}</span>
      {icon && (
        <svg
          className="stat-card-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )}
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-sub">{sub}</div>
  </div>
);

export default StatCard;
