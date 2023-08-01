"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register = (req, res) => {
    const ssid = req.body.ssid;
    const publicIP = req.ip;
    console.log(ssid);
    console.log(publicIP);
    res.send("registerd");
};
module.exports = { register };
