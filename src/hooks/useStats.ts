import { useEffect, useState } from "react";
import { Stats } from "../types/stats";

const INITIAL_STATS: Stats = { 
    byType: {
        ip: 0,
        domain: 0,
        hash: 0,
        url: 0
    }, total: 0, critical: 0, high: 0, medium: 0, low: 0 };

export const useStats = () => {
    const [stats, setStats] = useState<Stats>(INITIAL_STATS);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:3001/api/stats");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            setError("Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error };
}