import { Router } from "express";
import { renderDashboard, renderDevices, renderTransactions, renderUsers } from "../../controllers/dashboard/dashboard.controller";

const routerDashboard = Router();

// controllers



routerDashboard.get('/', renderDashboard);
routerDashboard.get('/devices', renderDevices)
routerDashboard.get('/transactions',renderTransactions)
routerDashboard.get('/users',renderUsers)


export {
    routerDashboard
};