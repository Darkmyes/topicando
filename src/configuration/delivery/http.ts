import { Express, Router, Request, Response } from "express"
import { Configuration, ConfigurationUsecase } from "../../domain/configuration"

export class ConfigurationHandler {
    configurationUC: ConfigurationUsecase;

    constructor(configurationUC: ConfigurationUsecase) {
        this.configurationUC = configurationUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});
        subRouter.get('/', async (req, res) => this.get(req,res));
        subRouter.post('/', async (req, res) => this.update(req,res));

        apiInstance.use('/configurations', subRouter)
    }

    async get (req: Request, res: Response) {
        let newConfiguration = await this.configurationUC.get()
        if (newConfiguration == null) {
            res.status(400)
            res.json( {"error" : "Error al traer las configuraciones"} )
            return
        }

        res.json(newConfiguration);
    }

    async update (req: Request, res: Response) {
        let configurationJSON = req.body as {
            max_evidences: number,
            primary_color: string,
            secondary_color: string,
            backgrund_color: string,
            toolbar_color: string,
            text_color: string,
            text_font: string,
            text_file: string
        };
        console.log(req.body)

        let configuration = {
            maxEvidences: configurationJSON.max_evidences,
            primaryColor: configurationJSON.primary_color,
            secondaryColor: configurationJSON.secondary_color,
            backgrundColor: configurationJSON.backgrund_color,
            toolbarColor: configurationJSON.toolbar_color,
            textColor: configurationJSON.text_color,
            textFont: configurationJSON.text_font,
            textFile: configurationJSON.text_file
        };

        let configurationUpdated = await this.configurationUC.update(configuration)
        if (!configurationUpdated) {
            res.status(400)
            res.json( {"error" : "Error al actualizar las configuraciones"} )
            return
        }

        res.json({message: "Se actualizaron correctamente las correccciones"});
    }

}