"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const devices_route_1 = require("./devices.route");
const router = express_1.default.Router();
exports.router = router;
const defaultRoutes = [
    {
        path: '/devices',
        route: devices_route_1.routerDevice,
    },
];
defaultRoutes.forEach((defaultRoutes) => {
    router.use(defaultRoutes.path, defaultRoutes.route);
});
