const routerDevice = require('express').Router();

// controllers
const devicesControler = require('../../controllers/devices.controller');


routerDevice.post('/register', devicesControler.register);


export {
    routerDevice
};