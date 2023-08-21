import { Router } from "express";

const routerDashboard = Router();

// controllers
import { requestOTC,registerDevice, getRegStatus } from "../../controllers/v1/devices.controller";


routerDashboard.post('/requestotc', requestOTC);
routerDashboard.post('/register', registerDevice)
routerDashboard.get('/regstatus',getRegStatus)


export {
    routerDashboard
};