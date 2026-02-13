import { PaginatedResponse, Indicator } from "../types/indicator";

interface PaginationProps {
  handlePaginationChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  data: PaginatedResponse<Indicator>;
}

const Pagination: React.FC<PaginationProps> = ({
  handlePaginationChange,
  data,
}) => {
  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing 1-20 of {data.total} indicators
      </span>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          data-dir="prev"
          onClick={handlePaginationChange}
          disabled={data.page === 1}
          data-testid="prev-page"
        >
          ‹
        </button>
        <button
          className="pagination-btn active"
          data-dir={data.page}
          onClick={handlePaginationChange}
          data-testid="current-page"
        >
          {data.page}
        </button>
        <button
          className="pagination-btn"
          data-dir={data.page + 1}
          onClick={handlePaginationChange}
          data-testid={`page-${data.page + 1}`}
        >
          {data.page + 1}
        </button>
        <button
          className="pagination-btn"
          data-dir={data.page + 2}
          onClick={handlePaginationChange}
          data-testid={`page-${data.page + 2}`}
        >
          {data.page + 2}
        </button>
        <button className="pagination-btn">…</button>
        <button
          className="pagination-btn"
          data-dir={data.totalPages}
          onClick={handlePaginationChange}
        >
          {data.totalPages}
        </button>
        <button
          className="pagination-btn"
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
