import AdmZip from 'adm-zip';
import * as path from 'path'
import * as util from 'util';
import MetaMfParser from './MetaMfParser';
import ApkSizeSummary from './ApkSizeSummary';
import { FilesSizeCalculator } from './FilesSizeCalculator';

export default class ApkAnalyzer {

    public async analyse(apkPath: string, workingDir?: string) : Promise<ApkSizeSummary> {
        if (util.isUndefined(workingDir)) {
            workingDir = path.join(path.dirname(apkPath), 'extracted');
        }

        // Extract the apk file
        const apkFile = new AdmZip(apkPath);
        console.log('Extracting APK file to ' + workingDir);
        apkFile.extractAllTo(workingDir, true);

        // Parse the IMF file
        const mfParser = new MetaMfParser(workingDir);
        await mfParser.parse();

        // Build Apk size summary
        const fileSizeCalc = new FilesSizeCalculator();
        const sizeSummary = new ApkSizeSummary();

        sizeSummary.apkFile = fileSizeCalc.getFileSize(apkPath);
        sizeSummary.arscFile = fileSizeCalc.getFilesSize(mfParser.getFiles('.arsc'));
        sizeSummary.dexFiles = fileSizeCalc.getFilesSize(mfParser.getFiles('.dex'));
        sizeSummary.nativeLibs = fileSizeCalc.getFilesSize(mfParser.getFiles('.so'));
        sizeSummary.installSize = sizeSummary.apkFile + sizeSummary.dexFiles;

        return sizeSummary;
    }

}
