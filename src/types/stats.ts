import { IndicatorType } from "./indicator";
export interface Stats {
    byType: Record<IndicatorType, number>;
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
}