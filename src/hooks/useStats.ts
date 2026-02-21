import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../api/apiClient";
import { Stats } from "../types/stats";

const INITIAL_STATS: Stats = {
  byType: {
    ip: 0,
    domain: 0,
    hash: 0,
    url: 0,
  },
  total: 0,
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
};

export const useStats = () => {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    const data = await apiRequest({
      method: "get",
      url: "/api/stats",
      setLoading,
      setError,
    });
    setStats(data);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, fetchStats };
};
