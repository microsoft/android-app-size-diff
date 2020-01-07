import * as adoTask from 'azure-pipelines-task-lib/task';
import CiRunner, { CiCore } from '../apkAnalyzer/CiRunner';
import { isUndefined } from 'util';

export class AdoCiCore implements CiCore {

    getInput(name: string): string {
        const value = adoTask.getInput(name);
        return isUndefined(value) ? "" : value;
    }
    
    setOutput(key: string, value: string) {
        return adoTask.setVariable(key, value);
    }

    logInfo(message: string) {
        return console.log(message);
    }

    logWarning(message: string) {
        return adoTask.warning(message);
    }

    logError(message: string) {
        return adoTask.error(message);
    }
}

export default class AdoTaskRunner {

    public async run() {
        try {
            const adoCiCore = new AdoCiCore();
            const ciRunner = new CiRunner(adoCiCore);
            await ciRunner.run();
        }
        catch (err) {
            adoTask.setResult(adoTask.TaskResult.Failed, err.message);
        }
    }

}
