import { Express, Router, Request, Response } from "express"
import { Role, RoleUsecase } from "../../domain/role"

export class RoleHandler {
    roleUC: RoleUsecase;

    constructor(roleUC: RoleUsecase) {
        this.roleUC = roleUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/', async(req,res) => this.list(req,res));

        apiInstance.use('/roles', subRouter)
    }

    async list (req: Request, res: Response) {
        let role = req.body as {rolename: string, password: string};

        let newRole = await this.roleUC.list()
        if (newRole == null) {
            res.status(400)
            res.json( {"error" : "Usuario o Contraseña incorrecta"} )
            return
        }

        res.json(newRole);
    }
}