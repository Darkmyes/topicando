import { Express, Router, Request, Response } from "express"
import { Category, CategoryUsecase } from "../../domain/category"

export class CategoryHandler {
    categoryUC: CategoryUsecase;

    constructor(categoryUC: CategoryUsecase) {
        this.categoryUC = categoryUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/', async (req, res) => this.list(req,res));
        subRouter.get('/:id', async (req, res) => this.byID(req,res));

        subRouter.post('/', async (req, res) => this.register(req,res));
        subRouter.put('/:id', async (req, res) => this.update(req,res));
        subRouter.delete('/:id', async (req, res) => this.delete(req,res));

        apiInstance.use('/categories', subRouter)
    }

    async list (req: Request, res: Response) {
        let categories = await this.categoryUC.list();
        res.json(categories);
    }
    async byID (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let category = await this.categoryUC.byID(id);
        if (category == null) {
            res.status(400)
            res.json( {"error" : "No se encuentró la categoría"} )
            return
        }

        res.json(category);
    }
    async register (req: Request, res: Response) {
        let category = req.body as Category;

        let newCategory = await this.categoryUC.register(category)
        if (newCategory == null) {
            res.status(400)
            res.json( {"error" : "No se pudo registrar categoría"} )
            return
        }

        res.json({message: "Se ha registrado la categoría exitosamente"});
    }
    async update (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let category = req.body as Category;

        let newCategory = await this.categoryUC.update(category)
        if (newCategory == null) {
            res.status(400)
            res.json( {"error" : "No se pudo actualizar la categoría"} )
            return
        }

        res.json({message: "Se ha actualizado la categoría exitosamente"});
    }
    async delete (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let newCategory = await this.categoryUC.delete(id)
        if (newCategory == null) {
            res.status(400)
            res.json( {"error" : "No se pudo eliminar la categoría"} )
            return
        }

        res.json({message: "Se ha eliminado la categoría exitosamente"});
    }

}