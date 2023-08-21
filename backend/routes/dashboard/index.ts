import { Router } from 'express'
import { routerDashboard } from './dashboard.route';
const dashRouter = Router();

type routeList = {
    path: string,
    route: any
}[]


const defaultRoutes: routeList = [
    {
        path: '/',
        route: routerDashboard,
    }
];


defaultRoutes.forEach(defaultRoutes => {
    dashRouter.use(defaultRoutes.path, defaultRoutes.route);
});

export {
    dashRouter
};
