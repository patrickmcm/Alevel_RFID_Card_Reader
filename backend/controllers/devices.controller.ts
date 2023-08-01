import { Request, Response } from 'express';



const register = (req: Request, res: Response) => {
    const ssid = req.body.ssid;
    const publicIP = req.ip
    console.log(ssid)
    console.log(publicIP)


    res.send("registerd");
}

module.exports = { register };