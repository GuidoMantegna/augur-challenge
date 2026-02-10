import { useState, useEffect, useMemo } from "react";
import { Indicator } from "../types/indicator";

interface indicatorsResponse {
    data: Indicator[];
    total: number;
    page: number;
    totalPages: number;
}

const INITIAL_INDICATORS: indicatorsResponse = {
    data: [],
    total: 0,
    page: 0,
    totalPages: 0
}
const SEVERITIES_OPTIONS = ["critical", "high", "medium", "low"];

export const useIndicators = () => {
    const [indicators, setIndicators] = useState<indicatorsResponse>(INITIAL_INDICATORS);
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
    const severities = useMemo(() => {
        const critical = indicators.data.filter((indicator) => indicator.severity === "critical");
        const high = indicators.data.filter((indicator) => indicator.severity === "high");
        const medium = indicators.data.filter((indicator) => indicator.severity === "medium");
        const low = indicators.data.filter((indicator) => indicator.severity === "low");
        return { critical, high, medium, low };
    }, [indicators]);

    return {
        indicators,
        severities,
        loading,
        error,
    };
};