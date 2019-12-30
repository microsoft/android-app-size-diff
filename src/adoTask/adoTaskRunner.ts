import * as adoTask from 'azure-pipelines-task-lib/task';
import * as util from 'util';
import ApkAnalyzer from '../apkAnalyzer/ApkAnalyzer';

export default class AdoTaskRunner {

    public async run() {
        try {
            const baseAppPath: string | undefined = adoTask.getInput('baseAppPath', true);
            const targetAppPath: string | undefined = adoTask.getInput('targetAppPath', true);
            const summaryOutputPath: string | undefined = adoTask.getInput('summaryOutputPath', false);

            if (util.isUndefined(baseAppPath) || util.isUndefined(targetAppPath)) {
                adoTask.setResult(adoTask.TaskResult.Failed, 'Invalid app paths supplied!');
                return;
            }

            const baseSizeSummary = await new ApkAnalyzer().analyse(baseAppPath);
            const targetSizeSummary = await new ApkAnalyzer().analyse(targetAppPath);

            console.log(baseSizeSummary);
            console.log(targetSizeSummary);
        }
        catch (err) {
            adoTask.setResult(adoTask.TaskResult.Failed, err.message);
        }
    }

}
