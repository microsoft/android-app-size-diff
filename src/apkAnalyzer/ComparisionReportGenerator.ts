import ApkAnalyzer from "./ApkAnalyzer";
import ComparisionReport from "./model/ComparisionReport";
import IReportor from './reporter/IReporter';

/**
 * Generates a report comparsing two different APks
 */

 export default class ComparisionReportGenerator {
   apkAnalyser: ApkAnalyzer;
   reporter: IReportor;

    public constructor(apkAnalyser : ApkAnalyzer, reporter: IReportor) {
      this.apkAnalyser = apkAnalyser;
      this.reporter = reporter;
    }

    public async generateComparisionReport(
       baseApkPath: string, 
       targetApkPath: string,
       reportOutputPath: string,
       baseApkLabel: string = 'Base APK',
       targetApkLabel: string = 'Target APK',
       includeMetrics: Array<string> = ['apkSize', 'installSize', 'dexFiles']) : Promise<ComparisionReport> {
         const baseSummary = await this.apkAnalyser.analyse(baseApkPath, baseApkLabel);
         const targetSummary = await this.apkAnalyser.analyse(targetApkPath, targetApkLabel);

         const comparisionReport = new ComparisionReport();
         comparisionReport.baseApkLabel = baseSummary.apkLabel;
         comparisionReport.targetApkLabel = targetSummary.apkLabel;

         includeMetrics.forEach(metric => {
            const baseMetric = baseSummary.sizeMetrics[metric];
            const targetMetric = baseSummary.sizeMetrics[metric];
            const difference = targetMetric - baseMetric;

            comparisionReport.comparisionMetrics.push({
               metricName: metric,
               baseValue: baseMetric,
               targetValue: targetMetric,
               difference: difference
            });
         });

         this.reporter.writeReport(comparisionReport, reportOutputPath);

         return comparisionReport;
    }
    
 }