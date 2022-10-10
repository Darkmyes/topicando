import { Express, Router, Request, Response } from "express"
import { Subcategory, SubcategoryUsecase } from "../../domain/subcategory"

export class SubcategoryHandler {
    subcategoryUC: SubcategoryUsecase;

    constructor(subcategoryUC: SubcategoryUsecase) {
        this.subcategoryUC = subcategoryUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.get('/by_category/:id', async (req, res) => this.byCategoryID(req,res));

        subRouter.post('/', async (req, res) => this.register(req,res));
        subRouter.put('/:id', async (req, res) => this.update(req,res));
        subRouter.delete('/:id', async (req, res) => this.delete(req,res));

        apiInstance.use('/subcategories', subRouter)
    }

    async byCategoryID (req: Request, res: Response) {
        let id = parseInt(req.params.id);
        if (id == undefined) {
            res.status(400)
            res.json( {"error" : "El id debe ser un valor numérico"} )
            return
        }

        let subcategories = await this.subcategoryUC.byCategoryID(id);
        res.json(subcategories);
    }
    async register (req: Request, res: Response) {
        let subcategoryJSON = req.body as {
            name: string,
            category_id: number
        };

        let subcategory: Subcategory = {
            id: 0,
            name: subcategoryJSON.name
        }

        let newSubcategory = await this.subcategoryUC.register(subcategory, subcategoryJSON.category_id)
        if (newSubcategory == null) {
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

        let subcategory = req.body as Subcategory;

        let newSubcategory = await this.subcategoryUC.update(subcategory)
        if (newSubcategory == null) {
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

        let newSubcategory = await this.subcategoryUC.delete(id)
        if (newSubcategory == null) {
            res.status(400)
            res.json( {"error" : "No se pudo eliminar la subcategoría"} )
            return
        }

        res.json({message: "Se ha eliminado la subcategoría exitosamente"});
    }

}