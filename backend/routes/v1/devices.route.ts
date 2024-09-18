import { Router } from "express";

const routerDevice = Router();

// controllers
import { requestOTC,registerDevice, getRegStatus, heartbeat } from "../../controllers/v1/devices.controller";
import { wsServer } from "../../app";


routerDevice.post('/requestotc', requestOTC);
routerDevice.post('/register', registerDevice)
routerDevice.get('/regstatus',getRegStatus)
wsServer.on('heartbeat', heartbeat)

export {
    routerDevice
};