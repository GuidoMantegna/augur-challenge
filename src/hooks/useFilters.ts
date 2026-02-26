import { useState, useCallback, useEffect } from "react";
import { PaginatedResponse, Indicator } from "../types/indicator";
import { apiRequest } from "../api/apiClient";

export const INITIAL_INDICATORS: PaginatedResponse<Indicator> = {
  data: [],
  total: 0,
  page: 1,
  totalPages: 0,
};

export const INITIAL_FILTERS = {
  search: "",
  severity: "",
  source: "",
  type: "",
  page: 1,
  limit: 20,
};

type Sorting = "Az" | "Za" | false;

export interface Filters {
  search: string;
  severity: string;
  source: string;
  type: string;
  page: number;
  limit: number;
  sort?: string;
  order?: Sorting;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [data, setData] =
    useState<PaginatedResponse<Indicator>>(INITIAL_INDICATORS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    // Debounce search
    if (!isSearch) {
      fetchFilters();
    } else {
      const timeout = setTimeout(() => {
        fetchFilters();
      }, 750);
      return () => clearTimeout(timeout);
    }
  }, [filters]);

  // HANDLERS
  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setIsSearch(event.target.name === "search");
      setFilters({ ...filters, [event.target.name]: event.target.value, page: 1 });
    },
    [filters, data],
  );

  const handlePaginationChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { dir } = event.currentTarget.dataset;
      setIsSearch(false);
      if (dir === "prev") {
        setFilters({ ...filters, page: filters.page - 1 });
      } else if (dir === "next") {
        setFilters({ ...filters, page: filters.page + 1 });
      } else {
        setFilters({ ...filters, page: Number(dir) });
      }
    },
    [filters, data],
  );

  const handleSorting = (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    const { sortid } = event.currentTarget.dataset;
    const order = filters.order === "Az" ? "Za" : "Az";
    setFilters({ ...filters, sort: sortid, order });
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const fetchFilters = useCallback(async () => {
    const data = await apiRequest({
      method: "get",
      url: "/api/indicators",
      params: filters,
      setLoading,
      setError,
    });
    setData(data);
  }, [filters]);

  return {
    filters,
    loading,
    error,
    handleFilterChange,
    data,
    clearFilters,
    handlePaginationChange,
    handleSorting,
    fetchFilters,
  };
};
