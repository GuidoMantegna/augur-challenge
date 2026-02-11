import { useState, useEffect, useMemo } from "react";
import { Indicator, PaginatedResponse } from "../types/indicator";

export const INITIAL_INDICATORS: PaginatedResponse<Indicator> = {
    data: [],
    total: 0,
    page: 0,
    totalPages: 0
}
export const useIndicators = () => {
    const [indicators, setIndicators] = useState<PaginatedResponse<Indicator>>(INITIAL_INDICATORS);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIndicators = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3001/api/indicators");
            const data = await response.json();
            setIndicators(data);
        } catch (error) {
            setError("Failed to fetch indicators");
        } finally {
            setLoading(false);
        }
    };

    
    
    useEffect(() => {
        fetchIndicators();
    }, []);

    return {
        indicators,
        loading,
        error,
    };
};