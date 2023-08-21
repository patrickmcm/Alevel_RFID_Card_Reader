import { Router } from 'express'
import { routerDevice } from './devices.route'
import { routerUser } from './users.route';
const apiRouterv1 = Router();

type routeList = {
    path: string,
    route: any
}[]


const defaultRoutes: routeList = [
    {
        path: '/devices',
        route: routerDevice,
    },
    {
        path: '/users',
        route: routerUser
    }
];


defaultRoutes.forEach(defaultRoutes => {
    apiRouterv1.use(defaultRoutes.path, defaultRoutes.route);
});

export {
    apiRouterv1
};
