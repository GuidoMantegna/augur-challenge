import { useState, useCallback, useEffect } from "react";
import { PaginatedResponse, Indicator, IndicatorFilters } from "../types/indicator";
import { apiRequest } from "../api/apiClient";

export const INITIAL_INDICATORS: PaginatedResponse<Indicator> = {
  data: [],
  total: 0,
  page: 1,
  totalPages: 0,
};

const INITIAL_FILTERS = {
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
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [data, setData] =
    useState<PaginatedResponse<Indicator>>(INITIAL_INDICATORS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<Sorting>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    // Debounce search
    if(!isSearch) {
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
      setFilters({ ...filters, [event.target.name]: event.target.value });
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

  const handleSorting = useCallback(() => {
    let sortedData = [...data.data];
    if (sorting === "Az") {
      sortedData.sort((a, b) => a.value.localeCompare(b.value));
    } else {
      sortedData.sort((a, b) => b.value.localeCompare(a.value));
    }
    setData({ ...data, data: sortedData });
    setSorting(sorting === "Az" ? "Za" : "Az");
  }, [data, sorting]);

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const fetchFilters = async () => {
    const data = await apiRequest({
      method: "get",
      url: "/api/indicators",
      params: filters,
      setLoading,
      setError,
    });
    setData(data);
  };

  return {
    filters,
    loading,
    error,
    handleFilterChange,
    data,
    clearFilters,
    handlePaginationChange,
    handleSorting,
  };
};
