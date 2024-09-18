import { Router } from "express";
import { renderDashboard, renderDevices, renderLogin, renderRegister, renderTransactions, renderUsers } from "../../controllers/dashboard/dashboard.controller";

const routerDashboard = Router();

// controllers



routerDashboard.get('/', renderDashboard);
routerDashboard.get('/devices', renderDevices)
routerDashboard.get('/transactions',renderTransactions)
routerDashboard.get('/users',renderUsers)
routerDashboard.get('/login', renderLogin)
routerDashboard.get('/register', renderRegister)


export {
    routerDashboard
};