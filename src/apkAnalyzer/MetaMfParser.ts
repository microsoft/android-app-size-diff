import LineReader from 'line-reader';
import * as path from 'path';
import * as util from 'util';

/**
 * Parses the contents of the Android MetaMf file and sorts the list of files based on extension 
 */
 export default class MetaMfParser {

    // Path which is root of the apk contents
    mBasePath: string;

    // Path to the actual .MF file
    mfFilePath: string;

    mFilesExtensionMap: Map<string, Array<string>>;

    constructor(apkContentsPath: string) {
        this.mBasePath = apkContentsPath;
        this.mfFilePath = path.join(apkContentsPath, 'META-INF', 'MANIFEST.MF');
        this.mFilesExtensionMap = new Map();
    }

    /**
     * Parses the file contents into extension groups
     */
    public async parse() {
        var eachLine: any = util.promisify(LineReader.eachLine);
        return eachLine(this.mfFilePath, (line: string) => {
            this.parseLine(line)
        });
    }

    /**
     * Gets array of files with the given extension
     */
    public getFiles(extension: string) : Array<string> | undefined {
        return this.mFilesExtensionMap.get(extension);
    }

    private parseLine(line: string) {
        // Ignore lines which doesn't point to a file
        if (!line.startsWith('Name: ')) {
            return;
        }
        
        const filePath = path.join(this.mBasePath, line.split('Name: ', 2)[1]);
        const extension = path.extname(filePath);
        
        if (!this.mFilesExtensionMap.has(extension)) {
            this.mFilesExtensionMap.set(extension, []);
        }

        const filesForExt = this.mFilesExtensionMap.get(extension);
        if (!util.isUndefined(filesForExt)) {
            filesForExt.push(filePath);
        }
    }
 }
