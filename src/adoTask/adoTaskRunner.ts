import * as adoTask from 'azure-pipelines-task-lib/task';
import * as util from 'util';
import ApkAnalyzer from '../apkAnalyzer/ApkAnalyzer';
import ComparisionReportGenerator from '../apkAnalyzer/ComparisionReportGenerator';
import { MarkdownReporter } from '../apkAnalyzer/reporter/MarkdownReporter';

export default class AdoTaskRunner {

    public async run() {
        try {
            const baseAppPath: string | undefined = adoTask.getInput('baseAppPath', true);
            const targetAppPath: string | undefined = adoTask.getInput('targetAppPath', true);
            const summaryOutputPath: string | undefined = adoTask.getInput('summaryOutputPath', false);

            if (util.isUndefined(baseAppPath) 
                || util.isUndefined(targetAppPath) 
                || util.isUndefined(summaryOutputPath)) {
                throw 'App paths not supplied!'
            }

            const apkAnalyzer = new ApkAnalyzer();
            const markdownReportor = new MarkdownReporter();
            const compareReportGenerator = new ComparisionReportGenerator(
                apkAnalyzer, markdownReportor);

            console.log(await compareReportGenerator.generateComparisionReport(
                baseAppPath,
                targetAppPath,
                summaryOutputPath,
                'Base APK',
                'Target APK',
                ['apkSize', 'installSize', 'dexFiles', 'arscFile']
            ));
        }
        catch (err) {
            adoTask.setResult(adoTask.TaskResult.Failed, err.message);
        }
    }

}
