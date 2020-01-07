import * as ghAction from '@actions/core';
import CiRunner, { CiCore } from '../apkAnalyzer/CiRunner';
import { isUndefined } from 'util';

export class GithubCiCore implements CiCore {

    getInput(name: string): string {
        const value = ghAction.getInput(name);
        return isUndefined(value) ? "" : value;
    }
    
    setOutput(key: string, value: string) {
        return ghAction.setOutput(key, value);
    }

    logInfo(message: string) {
        return ghAction.info(message);
    }

    logWarning(message: string) {
        return ghAction.warning(message);
    }

    logError(message: string) {
        return ghAction.error(message);
    }
}

export default class GithubActionRunner {

    public async run() {
        try {
            const githubCore = new GithubCiCore();
            const ciRunner = new CiRunner(githubCore);
            await ciRunner.run();
        }
        catch (err) {
            ghAction.setFailed(err.message);
        }
    }

}
