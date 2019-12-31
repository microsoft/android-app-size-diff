import * as ghAction from '@actions/core';
import CiRunner from '../apkAnalyzer/CiRunner';

export default class GithubActionRunner {

    public async run() {
        try {
            const ciRunner = new CiRunner(ghAction);
            await ciRunner.run();
        }
        catch (err) {
            ghAction.setFailed(err.message);
        }
    }

}
