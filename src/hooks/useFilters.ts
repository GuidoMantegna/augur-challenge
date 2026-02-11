import { useState, useCallback, useMemo, useEffect } from "react";
import { PaginatedResponse, Indicator } from "../types/indicator";
import { INITIAL_INDICATORS } from "./useIndicators";

const BASE_URL = "http://localhost:3001/api/indicators";

const INITIAL_FILTERS = {
  search: "",
  severity: "All Severities",
  source: "",
  type: "",
  page: 1,
  limit: 20,
};

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

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilters({ ...filters, [event.target.name]: event.target.value });
    },
    [filters],
  );

  const handlePaginationChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
        const { dir } = event.currentTarget.dataset;
        if (dir === 'prev') {
            setFilters({ ...filters, page: filters.page - 1 });
        } else if (dir === 'next') {
            setFilters({ ...filters, page: filters.page + 1 });
        } else {
            setFilters({ ...filters, page: Number(dir) });
        }
    },
    [filters, data],
  );    

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  useEffect(() => {
    // Debounce search
    const timeout = setTimeout(() => {
      fetchFilters(filters);
    }, 750);
    return () => clearTimeout(timeout);
  }, [filters]);

  const fetchFilters = async (params: Filters) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}?search=${params.search}&severity=${params.severity}&type=${params.type}&page=${params.page}&limit=${params.limit}`,
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Failed to fetch filters");
    } finally {
      setLoading(false);
    }
  };

  return { filters, loading, error, handleFilterChange, data, clearFilters, handlePaginationChange };
};
