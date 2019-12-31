import * as util from 'util';
import ApkAnalyzer from '../apkAnalyzer/ApkAnalyzer';
import ComparisionReportGenerator from '../apkAnalyzer/ComparisionReportGenerator';
import { MarkdownReporter } from '../apkAnalyzer/reporter/MarkdownReporter';

export interface CiCore {
    getInput(name: string): string | undefined;
}

/**
 * Runs Apk comparision on a CI - Github workflow or ADO Task
 */
export default class CiRunner {
    ciCore: CiCore; // either Github action core or ADO Task

    constructor(ciCore: CiCore) {
        this.ciCore = ciCore;
    }

    public async run() {
        const baseAppPath = this.ciCore.getInput('baseAppPath');
        const targetAppPath = this.ciCore.getInput('targetAppPath');
        const summaryOutputPath = this.ciCore.getInput('summaryOutputPath');

        if (util.isUndefined(baseAppPath) 
            || util.isUndefined(targetAppPath) 
            || util.isUndefined(summaryOutputPath)) {
            throw 'App paths not supplied!'
        }

        const apkAnalyzer = new ApkAnalyzer();
        const markdownReportor = new MarkdownReporter();
        const compareReportGenerator = new ComparisionReportGenerator(
            apkAnalyzer, markdownReportor);

        return console.log(await compareReportGenerator.generateComparisionReport(
            baseAppPath,
            targetAppPath,
            summaryOutputPath,
            'Base APK',
            'Target APK',
            ['apkSize', 'installSize', 'dexFiles', 'arscFile']
        ));
    }
    

}