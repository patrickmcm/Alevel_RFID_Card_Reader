import { Router } from "express";

const routerUser = Router();

// controllers
import { createUser } from "../../controllers/users.controller";

routerUser.post('/', createUser);

export {
    routerUser
};