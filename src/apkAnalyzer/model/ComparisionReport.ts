export interface ComparisionMetric {
    metricName: string;
    baseValue: number;
    targetValue: number;
    difference: number;
    threshold: number;
}

export default class ComparisionReport {
    baseApkLabel: string = '';
    targetApkLabel: string = '';
    comparisionMetrics: Array<ComparisionMetric> = [];
}