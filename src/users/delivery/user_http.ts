import { Express, Router } from "express"
import { User, UserUsecase } from "./../../domain/user"

export class UserHandler {
    userUC: UserUsecase;

    constructor(userUC: UserUsecase) {
        this.userUC = userUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});
        subRouter.post('/login', async (req, res, next) => {
            let user = req.body as User;

            let newUser = await this.userUC.login(user.username, user.password)
            if (newUser == null) {
                res.status(400)
                res.json( {"error" : "Usuario o Contraseña incorrecta"} )
                return
            }

            res.json(newUser);
        });
        subRouter.post('/', async (req, res, next) => {
            let user = req.body as User;

            let newUser = await this.userUC.register(user.username, user.password, user.rol)
            if (newUser == null) {
                res.status(400)
                res.json( {"error" : "No se pudo registrar usuario"} )
                return
            }

            res.json(newUser);
        });
        subRouter.post('/change_password', async (req, res, next) => {
            let user = req.body as User;

            let newUser = await this.userUC.changePassword(user.id, user.password)
            if (newUser == null) {
                res.status(400)
                res.json( {"error" : "No se pudo cambiar la contraseña del usuario"} )
                return
            }

            res.json(newUser);
        });
        subRouter.post('/change_rol', async (req, res, next) => {
            let user = req.body as User;

            let newUser = await this.userUC.changePassword(user.id, user.rol)
            if (newUser == null) {
                res.status(400)
                res.json( {"error" : "No se pudo cambiar el rol del usuario"} )
                return
            }

            res.json(newUser);
        });

        apiInstance.use('/users', subRouter)
    }

}