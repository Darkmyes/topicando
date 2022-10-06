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
        let configuration = req.body as Configuration;

        let configurationUpdated = await this.configurationUC.update(configuration)
        if (configurationUpdated) {
            res.status(400)
            res.json( {"error" : "Error al actualizar las configuraciones"} )
            return
        }

        res.json(configuration);
    }

}