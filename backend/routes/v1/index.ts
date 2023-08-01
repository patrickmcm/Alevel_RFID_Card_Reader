import express from 'express'
import { routerDevice } from './devices.route'
const router = express.Router();

const defaultRoutes = [
    {
        path: '/devices',
        route: routerDevice,
    },
];


defaultRoutes.forEach((defaultRoutes : {path: string, route: any}) => {
    router.use(defaultRoutes.path, defaultRoutes.route);
});

export {
    router
};
