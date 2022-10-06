import { Express, Router } from "express"
import { Recolection, RecolectionUsecase, AdminRecolectionUsecase } from "./../../domain/recolection"

export class RecolectionHandler {
    recolectionUC: RecolectionUsecase;
    adminRecolectionUC: AdminRecolectionUsecase;

    constructor(recolectionUC: RecolectionUsecase, adminRecolectionUC: AdminRecolectionUsecase) {
        this.recolectionUC = recolectionUC;
        this.adminRecolectionUC = adminRecolectionUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});
        subRouter.get('/', async (req, res, next) => {
            let recolections = await this.recolectionUC.list();
            res.json(recolections);
        });
        subRouter.get('/:id', async (req, res, next) => {
            let id = parseInt(req.params.id);

            if (id == undefined) {
                res.status(400)
                res.json( {"error" : "El id debe ser un valor numérico"} )
                return
            }

            let recolection = await this.recolectionUC.byID(id);
            if (recolection == null) {
                res.status(400)
                res.json( {"error" : "No se encuentró la recolección"} )
                return
            }

            res.json(recolection);
        });

        let adminSubRouter = Router({mergeParams: true})
        adminSubRouter.get('/', async (req, res, next) => {
            let recolections = await this.adminRecolectionUC.list();
            res.json(recolections);
        });
        adminSubRouter.get('/:id', async (req, res, next) => {
            let id = parseInt(req.params.id);
            if (id == undefined) {
                res.status(400)
                res.json( {"error" : "El id debe ser un valor numérico"} )
                return
            }

            let recolection = await this.adminRecolectionUC.byID(id);
            if (recolection == null) {
                res.status(400)
                res.json( {"error" : "No se encuentró la recolección"} )
                return
            }

            res.json(recolection);
        });
        adminSubRouter.post('/', async (req, res, next) => {
            let recolection = req.body as Recolection;

            let newRecolection = await this.adminRecolectionUC.register(recolection)
            if (newRecolection == null) {
                res.status(400)
                res.json( {"error" : "No se pudo registrar recolección"} )
                return
            }

            res.json(newRecolection);
        });
        adminSubRouter.put('/:id', async (req, res, next) => {
            let id = parseInt(req.params.id);
            if (id == undefined) {
                res.status(400)
                res.json( {"error" : "El id debe ser un valor numérico"} )
                return
            }

            let recolection = req.body as Recolection;

            let newRecolection = await this.adminRecolectionUC.update(recolection, id)
            if (newRecolection == null) {
                res.status(400)
                res.json( {"error" : "No se pudo registrar recolección"} )
                return
            }

            res.json(newRecolection);
        });
        adminSubRouter.delete('/:id', async (req, res, next) => {
            let id = parseInt(req.params.id);
            if (id == undefined) {
                res.status(400)
                res.json( {"error" : "El id debe ser un valor numérico"} )
                return
            }

            let newRecolection = await this.adminRecolectionUC.delete(id)
            if (newRecolection == null) {
                res.status(400)
                res.json( {"error" : "No se pudo registrar recolección"} )
                return
            }

            res.json(newRecolection);
        });

        apiInstance.use('/recolections', subRouter)
        apiInstance.use('/admin/recolections', adminSubRouter)
    }

}