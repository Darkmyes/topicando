export class Configuration {
    maxEvidences: number;
    primaryColor: string;
    secondaryColor: string;
    backgrundColor: string;
    toolbarColor: string;
    textColor: string;
    textFont: string;
    textFile: string;

    constructor () {
        this.maxEvidences = 0;
        this.primaryColor = "";
        this.secondaryColor = "";
        this.backgrundColor = "";
        this.toolbarColor = "";
        this.textColor = "";
        this.textFont = "";
        this.textFile = "";
    }
}

export interface ConfigurationRepository {
    get() : Promise<Configuration>;
    update(configuration: Configuration) : Promise<boolean>;
}

export interface ConfigurationUsecase {
    get() : Promise<Configuration>;
    update(configuration: Configuration) : Promise<boolean>;
}
