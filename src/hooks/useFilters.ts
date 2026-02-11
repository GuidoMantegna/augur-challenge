import { useState, useCallback, useMemo, useEffect } from "react";

const BASE_URL = "http://localhost:3001/api/indicators";

interface Filters {
    search: string;
    severity: string;
    type: string;
    page: number;
    limit: number;
}

export const useFilters = (queryParams: Filters) => {
    const [filters, setFilters] = useState<Filters>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFilters(queryParams);
    }, [filters]);

    const fetchFilters = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}?search=${event.target.value}&severity=${queryParams.severity}&type=${queryParams.type}&page=${queryParams.page}&limit=${queryParams.limit}`);
            const data = await response.json();
            setFilters(data);
        } catch (error) {
            setError("Failed to fetch filters");
        } finally {
            setLoading(false);
        }
    }, []);

    return { filters, loading, error, fetchFilters }
}