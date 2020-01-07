import ApkAnalyzer from '../apkAnalyzer/ApkAnalyzer';
import ComparisionReportGenerator from '../apkAnalyzer/ComparisionReportGenerator';
import { MarkdownReporter } from '../apkAnalyzer/reporter/MarkdownReporter';
import ComparisionReport from './model/ComparisionReport';
import ThresholdChecker from './ThresholdChecker';
import * as appInsights from 'applicationinsights'

export interface CiCore {

    /**
     * @returns the name of the CI
     */
    getCiName(): string;

    /**
     * Gets an input from the CI
     * @param name
     */
    getInput(name: string): string;

    /**
     * Sets an output variable on the CI
     * @param key 
     * @param value 
     */
    setOutput(key: string, value: string): any;

    logInfo(message: string): any;
    logWarning(message: string): any;
    logError(message: string): any;

    /**
     * Marks the run as failure
     * @param errorMessage Error message
     */
    markAsFailed(errorMessage: string): any;
}

/**
 * Runs Apk comparision on a CI - Github workflow or ADO Task
 */
export default class CiRunner {
    ciCore: CiCore; // either Github action core or ADO Task
    thresholdChecker: ThresholdChecker;
    telemetryClient: appInsights.TelemetryClient;

    constructor(ciCore: CiCore) {
        this.ciCore = ciCore;
        this.thresholdChecker = new ThresholdChecker(ciCore);

        // Configure and enable telemetry
        appInsights.setup('0ba004b8-ff05-41fa-a241-3f026d68fc3a') // Change this to your own instrumentation key
            .setAutoCollectExceptions(true)
            .setSendLiveMetrics(false)
            .start();
        this.telemetryClient = appInsights.defaultClient;
    }

    public async runWithTelemetry() {
        // Send app start telemetry
        const startTime = new Date().getTime();
        const telemetryProperties = {
            ciName: this.ciCore.getCiName()
        }
        this.telemetryClient.trackEvent({
            name: 'AppStart',
            properties: telemetryProperties
        });

        var result: any;
        try {
            result = await this.run();
        } catch (err) {
            // Send error telemetry
            this.telemetryClient.trackException({
                exception: err,
                properties: telemetryProperties
            });
            this.telemetryClient.flush()

            throw err;
        }

        // Send performance telemetry
        const endTime = new Date().getTime();
        const elapsedTime = endTime - startTime;
        this.telemetryClient.trackMetric({
            name: 'RunPerformance',
            value: elapsedTime,
            properties: telemetryProperties
        });
        this.telemetryClient.flush()

        return result;
    }

    private async run() {
        const baseAppPath = this.ciCore.getInput('baseAppPath');
        const targetAppPath = this.ciCore.getInput('targetAppPath');
        const baseAppLabel = this.ciCore.getInput('baseAppLabel');
        const targetAppLabel = this.ciCore.getInput('targetAppLabel');
        const summaryOutputPath = this.ciCore.getInput('summaryOutputPath');
        const metrics = this.ciCore.getInput('metrics');
        const thresholds = this.ciCore.getInput('thresholds');

        var abortRun = false;
        if (!baseAppPath || !targetAppPath) {
            this.ciCore.logError('App paths not supplied!');
            abortRun = true;
        }

        if (!baseAppLabel || !targetAppLabel) {
            this.ciCore.logError('App labels not supplied!');
            abortRun = true;
        }

        if (!summaryOutputPath) {
            this.ciCore.logError('Summary path not supplied!');
            abortRun = true;
        }

        if (!metrics) {
            this.ciCore.logError('Must pick at least one metric!');
            abortRun = true;
        }

        const metricsList: Array<string> = this.readCsv(metrics);
        var thresholdsList: Array<number> = []
        try {
            thresholdsList = this.parseThresholdsFromInput(thresholds, metricsList);
        } catch (error) {
            this.ciCore.logError('Error parsing thresholds! ' + error);
            abortRun = true;
        }

        // Fail if we have to abort because at least one of the required conditions are not met
        if (abortRun) {
            throw 'Invalid / illegal task inputs!';
        }

        const apkAnalyzer = new ApkAnalyzer();
        const markdownReportor = new MarkdownReporter();
        const compareReportGenerator = new ComparisionReportGenerator(
            apkAnalyzer, markdownReportor);

        const comparisionReport : ComparisionReport = await compareReportGenerator.generateComparisionReport(
            baseAppPath,
            targetAppPath,
            summaryOutputPath,
            baseAppLabel,
            targetAppLabel,
            metricsList,
            thresholdsList
        );

        // Check if thresholds are adhered to
        if (!this.thresholdChecker.checkThresholds(comparisionReport)) {
            this.ciCore.markAsFailed('App size increased significantly in at least one metric!');
        }
        console.log(comparisionReport);

        return comparisionReport;
    }

    private parseThresholdsFromInput(thresholdsInput: string, metricsList: Array<string>): Array<number> {
        const thresholdsList: Array<number> = [];

        // If no thresholds set, just use NaN for each metric as a threshold
        if (!thresholdsInput) {
            this.ciCore.logWarning('No thresholds supplied. Drastic changes in app size metrics will not fail this task!');
            metricsList.forEach(() => thresholdsList.push(NaN));
            return thresholdsList;
        }

        // Check if same number of thresholds and metrics are passed
        const thresholdStrings: Array<string> = this.readCsv(thresholdsInput);
        if (thresholdStrings.length != metricsList.length) {
            throw 'Thresholds must be set corresponding to each metric in metrics or none!';
        }

        // Parse threshold for each metric
        metricsList.forEach((_, index) => {
            const thresholdValue = parseInt(thresholdStrings[index]);
            thresholdsList.push(thresholdValue);
        });
        return thresholdsList;
    }
    
    private readCsv(inputString: string): Array<string> {
        const valuesList: Array<string> = inputString.split(',');
        return valuesList.map((value) => value.trim());
    }

}