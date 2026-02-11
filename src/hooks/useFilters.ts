import { useState, useCallback, useMemo, useEffect } from "react";
import { PaginatedResponse, Indicator } from "../types/indicator";
import { INITIAL_INDICATORS } from "./useIndicators";

const BASE_URL = "http://localhost:3001/api/indicators";

const INITIAL_FILTERS = {
  search: '',
  severity: '',
  source: '',
  type: '',
  page: 1,
  limit: 10
}

export interface Filters {
    search: string;
    severity: string;
    source: string;
    type: string;
    page: number;
    limit: number;
}

export const useFilters = (queryParams: Filters) => {
    const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
    const [data, setData] = useState<PaginatedResponse<Indicator>>(INITIAL_INDICATORS);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        console.log(event.target.value);
        setFilters({ ...filters, [event.target.name]: event.target.value });
    // fetchFilters(event); 
  };

    useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => {
            fetchFilters(filters);
        }, 1500);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchFilters = useCallback(async (params: Filters) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}?search=${params.search}&severity=${params.severity}&type=${params.type}&page=${params.page}&limit=${params.limit}`);
            const data = await response.json();
            setData(data);
        } catch (error) {
            setError("Failed to fetch filters");
        } finally {
            setLoading(false);
        }
    }, []);

    return { filters, loading, error, fetchFilters, setFilters, handleFilterChange, data };
}