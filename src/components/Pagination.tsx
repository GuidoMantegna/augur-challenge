import { PaginatedResponse, Indicator } from "../types/indicator";
import { getPageNumbers } from "../utils";

const PaginationButton = ({
  page,
  handlePaginationChange,
  selected,
}: {
  page: number | string;
  handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
}) => {
  return (
    <button
      className={`pagination-btn ${selected ? "active" : ""}`}
      data-dir={page}
      onClick={handlePaginationChange}
      data-testid={`page-${page}`}
    >
      {page}
    </button>
  );
};

interface PaginationProps {
  handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  data: PaginatedResponse<Indicator>;
}

const Pagination: React.FC<PaginationProps> = ({
  handlePaginationChange,
  data,
}) => {
  const pages = getPageNumbers(data.page, data.totalPages);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing 1-20 of {data.total} indicators
      </span>
      <div className="pagination-controls">
        <button
          className="btn pagination-btn"
          data-dir="prev"
          onClick={handlePaginationChange}
          disabled={data.page === 1}
          data-testid="prev-page"
        >
          ‹
        </button>
        <ul className="flex gap-1">
          {pages.map((p, i) => (
            <li key={`${p}-${i}`}>
              <PaginationButton
                page={p}
                handlePaginationChange={
                  p === "..." ? () => {} : handlePaginationChange
                }
                selected={p === data.page}
              />
            </li>
          ))}
        </ul>
        <button
          className="btn pagination-btn"
          data-dir="next"
          onClick={handlePaginationChange}
          disabled={data.page === data.totalPages}
          data-testid="next-page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
