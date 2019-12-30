import IReporter from './IReporter';
import ComparisionReport from '../model/ComparisionReport';
import * as fs from 'fs';

export class MarkdownReporter implements IReporter {

    public async writeReport(comparisionReport: ComparisionReport, outputPath: string) {
        var report = '';

        // Title row
        report += this.buildRow(
            'Metric', 
            comparisionReport.baseApkLabel, 
            comparisionReport.targetApkLabel, 
            'Difference');

        // Seperator row
        report += this.buildRow('---', '---', '---', '---');

        // A row per metric
        comparisionReport.comparisionMetrics.forEach(compareMetric => {
            report += this.buildRow(
                compareMetric.metricName, 
                String(compareMetric.baseValue), 
                String(compareMetric.targetValue), 
                String(compareMetric.difference));
        });

        return fs.writeFileSync(outputPath, report);
    }

    private buildRow(...cellStrings : string[]) : string {
        return cellStrings.join(' | ') + ' | \n';
    }
}