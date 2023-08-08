import { Router } from "express";

const routerUser = Router();

// controllers
import { createUser, loginUser } from "../../controllers/users.controller";

routerUser.post('/register', createUser);
routerUser.post('/login', loginUser);

export {
    routerUser
};