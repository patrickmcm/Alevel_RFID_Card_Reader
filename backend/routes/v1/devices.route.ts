import { Router } from "express";

const routerDevice = Router();

// controllers
import { requestOTC,registerDevice, getRegStatus } from "../../controllers/devices.controller";


routerDevice.post('/requestotc', requestOTC);
routerDevice.post('/register', registerDevice)
routerDevice.get('/regstatus',getRegStatus)


export {
    routerDevice
};