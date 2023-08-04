const routerDevice = require('express').Router();

// controllers
const devicesControler = require('../../controllers/devices.controller');


routerDevice.post('/requestotc', devicesControler.requestOTC);


export {
    routerDevice
};