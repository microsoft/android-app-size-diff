import AdmZip from 'adm-zip';
import * as path from 'path'
import * as util from 'util';
import MetaMfParser from './MetaMfParser';
import ApkSizeSummary from './model/ApkSizeSummary';
import { FilesSizeCalculator } from './FilesSizeCalculator';

export default class ApkAnalyzer {

    public async analyse(apkPath: string, apkLabel: string, workingDir?: string) : Promise<ApkSizeSummary> {
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

        sizeSummary.apkLabel = apkLabel;
        sizeSummary.sizeMetrics['apkSize'] = fileSizeCalc.getFileSize(apkPath);
        sizeSummary.sizeMetrics['arscFile'] = fileSizeCalc.getFilesSize(mfParser.getFiles('.arsc'));
        sizeSummary.sizeMetrics['dexFiles'] = fileSizeCalc.getFilesSize(mfParser.getFiles('.dex'));
        sizeSummary.sizeMetrics['nativeLibs'] = fileSizeCalc.getFilesSize(mfParser.getFiles('.so'));
        sizeSummary.sizeMetrics['installSize'] = sizeSummary.sizeMetrics['apkSize'] + sizeSummary.sizeMetrics['dexFiles'];

        return sizeSummary;
    }

}
