import { Indicator } from "../types/indicator";
import { timeAgoHM } from "../utils";

const LoadingRow: React.FC = () => {
  return (
    <>
      <td className="td-checkbox"></td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
      <td>
        <div className="w-full h-[20px] bg-[var(--border-default)] rounded animate-pulse"></div>
      </td>
    </>
  );
};
interface TableRowProps extends Indicator {
  selected: boolean;
  loading: boolean;
}
const TableRow: React.FC<TableRowProps> = ({
  value,
  type,
  severity,
  confidence,
  source,
  tags,
  lastSeen,
  selected,
  loading,
}) => {
  if (loading) return <LoadingRow />;
  return (
    <>
      <td className="td-checkbox">
        <input
          type="checkbox"
          defaultChecked={selected}
          style={{ accentColor: "var(--augur-blue)" }}
        />
      </td>
      <td className="td-indicator" data-testid="td-indicator">
        {value}
      </td>
      <td>
        <span className="td-type">{type}</span>
      </td>
      <td>
        <span
          className={`badge badge-${severity.toLowerCase()}`}
          data-testid="td-severity"
        >
          {severity}
        </span>
      </td>
      <td>
        <div className="td-confidence">
          <div className="confidence-bar">
            <div
              className="confidence-bar-fill"
              style={{
                width: `${confidence}%`,
                background: `var(--severity-${severity.toLowerCase()})`,
              }}
            ></div>
          </div>
          <span
            className="confidence-value"
            style={{ color: `var(--severity-${severity.toLowerCase()})` }}
          >
            {confidence}
          </span>
        </div>
      </td>
      <td className="td-source">{source}</td>
      <td className="td-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag tag-red">
            {tag}
          </span>
        ))}
      </td>
      <td className="td-time">{timeAgoHM(lastSeen)}</td>
    </>
  );
};

export default TableRow;
