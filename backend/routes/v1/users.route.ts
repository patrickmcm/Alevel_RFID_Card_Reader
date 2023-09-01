import { Router } from "express";

const routerUser = Router();

// controllers
import { createUser, loginUser, logoutUser } from "../../controllers/v1/users.controller";


routerUser.post('/register', createUser);
routerUser.post('/login', loginUser);
routerUser.get('/logout', logoutUser)

export {
    routerUser
};