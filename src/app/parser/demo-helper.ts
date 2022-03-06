declare var AdmZip: any;
declare var Buffer: any;

const MATCH_INFO_FILENAME = 'match-info.json';
const ROUND_FILE_PREFIX = 'round-gameStates';

export class CsgoDemoFileWriter {
    private zip: any = new AdmZip();

    constructor() { }

    saveRoundGameStates(roundInfo: any, roundNo: number, gameStates: any[]) {
        const roundFilename = `${ROUND_FILE_PREFIX}-${roundNo}.json`;
        const gameStateStr = JSON.stringify(gameStates);
        this.zip.addFile(roundFilename, Buffer.from(gameStateStr, 'utf8'));
        roundInfo.gameStateFile = roundFilename;
    }

    saveMatchInfo(matchInfo: any) {
        const matchInfoFilename = MATCH_INFO_FILENAME;
        const matchInfoStr = JSON.stringify(matchInfo);
        this.zip.addFile(matchInfoFilename, Buffer.from(matchInfoStr, 'utf8'));
    }

    saveZip(zipFilename) {
        this.zip.writeZip(zipFilename);
    }

    getZip() {
        return this.zip;
    }
}

export class CsgoDemoFile {
    private zip: any;

    constructor(zip: any, private filename: string) {
        if(filename) {
            this.zip = new AdmZip(filename);
        } else {
            this.zip = zip;
        }
    }

    getFilename() {
        return this.filename;
    }

    getMatchInfo() {
        return JSON.parse(this.zip.readAsText(MATCH_INFO_FILENAME));
    }

    getRoundInfo(name) {
        return JSON.parse(this.zip.readAsText(name));
    }

    saveZip(filename) {
        this.zip.writeZip(filename);
    }
}
