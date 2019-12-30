import * as tl from 'azure-pipelines-task-lib/task';
import * as shell from "shelljs";
import * as os from 'os';
import * as path from 'path';

export default class AdoTaskRunner {

    public async run() {
        const platform = os.type();

        const apkanalyzerPath = path.join('dist', 'src', 'bin', platform, 'tools', 'bin', 'apkanalyzer');
        const testApkPath = path.join('test', 'assets', 'test.apk');

        shell.exec(apkanalyzerPath + ' apk download-size ' + testApkPath);

        try {
            const inputString: string | undefined = tl.getInput('baseAppPath', true);
            if (inputString == 'bad') {
                tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                return;
            }
            console.log('Hello', inputString);
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }

}
