const routerUser = require('express').Router();

// controllers
const usersController = require('../../controllers/users.controller');

routerUser.post('/create', usersController.createUser);


export {
    routerUser
};