const StatsLoading: React.FC = () => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="w-2/3 h-[15px] bg-[var(--border-default)] rounded animate-pulse"></span>
      </div>
      <div className="w-1/2 h-[40px] bg-[var(--border-default)] rounded animate-pulse">
      </div>
      <div className="w-3/5 h-[10px] bg-[var(--border-default)] rounded animate-pulse">
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  type?: string;
  icon?: boolean;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  type,
  icon,
  loading,
}) => {
  if (loading) return <StatsLoading />;
  return (
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
};

export default StatCard;
