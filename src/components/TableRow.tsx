import { Indicator } from "../types/indicator";
import { timeAgoHM } from "../utils";
interface TableRowProps extends Indicator {
  selected: boolean;
}
const TableRow: React.FC<TableRowProps> = ({
  id,
  value,
  type,
  severity,
  confidence,
  source,
  tags,
  lastSeen,
  selected,
}) => (
  <tr key={id} className={selected ? "selected" : ""}>
    <td>
      <input
        type="checkbox"
        defaultChecked={selected}
        style={{ accentColor: "var(--augur-blue)" }}
      />
    </td>
    <td className="td-indicator">{value}</td>
    <td>
      <span className="td-type">{type}</span>
    </td>
    <td>
      <span className={`badge badge-${severity.toLowerCase()}`}>
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
  </tr>
);

export default TableRow;
