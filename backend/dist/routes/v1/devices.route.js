"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerDevice = void 0;
const routerDevice = require('express').Router();
exports.routerDevice = routerDevice;
// controllers
const devicesControler = require('../../controllers/devices.controller');
routerDevice.post('/register', devicesControler.register);
