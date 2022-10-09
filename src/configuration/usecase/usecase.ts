import { Configuration, ConfigurationUsecase, ConfigurationRepository } from "../../domain/configuration"

export class ConfigurationUC implements ConfigurationUsecase {
    configurationRepo: ConfigurationRepository;

    constructor(configurationRepo: ConfigurationRepository) {
        this.configurationRepo = configurationRepo;
    }

    async get(): Promise<Configuration> {
        return await this.configurationRepo.get()
    }

    async update(configuration: Configuration): Promise<boolean> {
        if (configuration.maxEvidences < 0) {
            throw new Error("El máximo de evidencias no puede ser menor a 0")
        }
        if (configuration.primaryColor.length == 0) {
            throw new Error("El Color Primario no puede estar vacío")
        }
        if (configuration.secondaryColor.length == 0) {
            throw new Error("El Color Secundario no puede estar vacío")
        }
        if (configuration.backgrundColor.length == 0) {
            throw new Error("El Color de Fondo no puede estar vacío")
        }
        if (configuration.textColor.length == 0) {
            throw new Error("El Color del Texto no puede estar vacío")
        }
        if (configuration.textFile.length == 0) {
            throw new Error("El Color de Selector de Archivos no puede estar vacío")
        }
        if (configuration.textFont.length == 0) {
            throw new Error("El Tipo de Fuente no puede estar vacío")
        }
        if (configuration.toolbarColor.length == 0) {
            throw new Error("El Color del Toolbar no puede estar vacío")
        }

        return await this.configurationRepo.update(configuration);
    }

}