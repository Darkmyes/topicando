import { Express, Router, Request, Response } from "express"
import { User, UserUsecase } from "../../domain/user"

export class UserHandler {
    userUC: UserUsecase;

    constructor(userUC: UserUsecase) {
        this.userUC = userUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.post('/', async(req,res) => this.register(req,res));
        subRouter.post('/login', async(req,res) => this.login(req,res));
        subRouter.post('/change_password', async(req,res) => this.changePassword(req,res));
        subRouter.post('/change_rol', async(req,res) => this.changeRol(req,res));

        apiInstance.use('/users', subRouter)
    }

    async login (req: Request, res: Response) {
        let user = req.body as {username: string, password: string};

        let newUser = await this.userUC.login(user.username, user.password)
        if (newUser == null) {
            res.status(400)
            res.json( {"error" : "Usuario o Contraseña incorrecta"} )
            return
        }

        res.json(newUser);
    }
    async register (req: Request, res: Response) {
        let user = req.body as {username: string, password: string, role_id: number};

        let newUser = await this.userUC.register(user.username, user.password, user.role_id)
        if (newUser == null) {
            res.status(400)
            res.json( {"error" : "No se pudo registrar el Usuario"} )
            return
        }

        res.json(newUser);
    }
    async changePassword (req: Request, res: Response) {
        let user = req.body as User;

        let newUser = await this.userUC.changePassword(user.id, user.password)
        if (newUser == null) {
            res.status(400)
            res.json( {"error" : "No se pudo cambiar la contraseña del usuario"} )
            return
        }

        res.json(newUser);
    }
    async changeRol (req: Request, res: Response) {
        let user = req.body as {id: number, rol_id: number};

        let newUser = await this.userUC.changeRole(user.id, user.rol_id)
        if (newUser == null) {
            res.status(400)
            res.json( {"error" : "No se pudo cambiar el rol del usuario"} )
            return
        }

        res.json(newUser);
    }
}