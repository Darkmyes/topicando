import { Express, Router, Request, Response } from "express"
import { Postbox, PostboxUsecase } from "../../domain/postbox"

export class PostboxHandler {
    postboxUC: PostboxUsecase;

    constructor(postboxUC: PostboxUsecase) {
        this.postboxUC = postboxUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/', async (req, res) => this.list(req,res));
        subRouter.get('/by_category/:id', async (req, res) => this.byCategoryID(req,res));
        subRouter.get('/by_subcategory/:id', async (req, res) => this.bySubcategoryID(req,res));
        subRouter.get('/:id', async (req, res) => this.byID(req,res));

        subRouter.post('/', async (req, res) => this.register(req,res));
        subRouter.put('/:id', async (req, res) => this.update(req,res));
        subRouter.delete('/:id', async (req, res) => this.delete(req,res));

        apiInstance.use('/postboxes', subRouter)
    }

    async list (req: Request, res: Response) {
        let postboxes = await this.postboxUC.list();
        res.json(postboxes);
    }
    async byCategoryID (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let postboxes = await this.postboxUC.byCategoryID(id);
        res.json(postboxes);
    }
    async bySubcategoryID (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let postboxes = await this.postboxUC.bySubcategoryID(id);
        res.json(postboxes);
    }
    async byID (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let postbox = await this.postboxUC.byID(id);
        if (postbox == null) {
            res.status(400)
            res.json( {"error" : "No se encuentró la subcategoría"} )
            return
        }

        res.json(postbox);
    }
    async register (req: Request, res: Response) {
        let postbox = req.body as Postbox;

        let newPostbox = await this.postboxUC.register(postbox)
        if (newPostbox == null) {
            res.status(400)
            res.json( {"error" : "No se pudo registrar subcategoría"} )
            return
        }

        res.json({message: "Se ha registrado la subcategoría exitosamente"});
    }
    async update (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let postbox = req.body as Postbox;

        let newPostbox = await this.postboxUC.update(postbox)
        if (newPostbox == null) {
            res.status(400)
            res.json( {"error" : "No se pudo actualizar subcategoría"} )
            return
        }

        res.json({message: "Se ha actualizado la subcategoría exitosamente"});
    }
    async delete (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let newPostbox = await this.postboxUC.delete(id)
        if (newPostbox == null) {
            res.status(400)
            res.json( {"error" : "No se pudo eliminar la subcategoría"} )
            return
        }

        res.json({message: "Se ha eliminado la subcategoría exitosamente"});
    }

}