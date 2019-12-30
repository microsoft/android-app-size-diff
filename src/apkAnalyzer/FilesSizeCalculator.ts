/**
 * Calculates the cummulative size of given file(s)
 */
import * as fs from 'fs';
import * as util from 'util';

 export class FilesSizeCalculator {

    /**
     * Returns the cummulative size of all the files
     */
    public getFilesSize(filePaths: string[] | undefined) : number {
        var totalSize = 0;

        if (!util.isNullOrUndefined(filePaths)) {
            filePaths.forEach(filePath => {
                totalSize += this.getFileSize(filePath);
            });
        }
        
        return totalSize;
    }

    public getFileSize(filePath: string) : number {
        const stats = fs.statSync(filePath);
        return stats["size"];
    }

 }
