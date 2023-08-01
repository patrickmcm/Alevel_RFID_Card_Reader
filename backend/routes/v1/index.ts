import express from 'express'
import { routerDevice } from './devices.route'
const router = express.Router();

type routeList = {
    path: string,
    route: any
}[]


const defaultRoutes: routeList = [
    {
        path: '/devices',
        route: routerDevice,
    },
];


defaultRoutes.forEach(defaultRoutes => {
    router.use(defaultRoutes.path, defaultRoutes.route);
});

export {
    router
};
