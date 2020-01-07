import ComparisionReport from "./model/ComparisionReport";
import { CiCore } from "./CiRunner";

/**
 * Checks that Comparision report follows the given threshold contraints
 */
export default class ThresholdChecker {
    ciCore: CiCore;

    constructor(ciCore: CiCore) {
        this.ciCore = ciCore;
    }

    /**
     * Checks thresholds for each metric in the comparision report
     * @returns true if all thresholds are upheld. false if any single threshold has failed.
     */
    public checkThresholds(comparisionReport: ComparisionReport) : boolean {
        var thresholdsUpheld = true;
        comparisionReport.comparisionMetrics.forEach(metric => {
            if (metric.threshold == NaN) {
                this.ciCore.logInfo(metric.metricName + ': ignoring threshold for metric!');
                return;
            }

            if (metric.difference > metric.threshold) {
                this.ciCore.logError(metric.metricName + ' increased more than threshold!');
                thresholdsUpheld = false;
            }
        });
        return thresholdsUpheld;
    }
}