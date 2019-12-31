import * as adoTask from 'azure-pipelines-task-lib/task';
import CiRunner from '../apkAnalyzer/CiRunner';

export default class AdoTaskRunner {

    public async run() {
        try {
            const ciRunner = new CiRunner(adoTask);
            await ciRunner.run();
        }
        catch (err) {
            adoTask.setResult(adoTask.TaskResult.Failed, err.message);
        }
    }

}
