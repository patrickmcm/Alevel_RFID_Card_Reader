import { Router } from 'express'
import { routerDevice } from './devices.route'
import { routerUser } from './users.route';
const router = Router();

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
    router.use(defaultRoutes.path, defaultRoutes.route);
});

export {
    router
};
