import ComparisionReport from '../model/ComparisionReport'

export default interface IReporter {

    writeReport(comparisionReport: ComparisionReport, outputPath: string) : Promise<any>;
}