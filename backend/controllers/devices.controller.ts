import { Request, Response } from 'express';
import { deviceInterface } from '../db/devices.types';
import { hmac } from '../utils/hmac';
import httpStatus from 'http-status';
import getDB from '../db/connect';

/*
TASK: SETUP BASIC SIGNING AND COMMUNICATION BETWEEN CLIENT-SERVER

1. REQUEST INFORMATION FROM THE CLIENT
2. GENERATE CODE AND SEND BACK
3. SETUP ANOTHER ROUTE, ACCEPTS CODE AND CHANGE RECORD IN DB



*/



const register = async (req: Request, res: Response) => {
    const signature = req.body.signature
    const ssid = req.body.ssid;
    const uid = req.body.uid
    const publicIP = req.ip


    try {
        if (!ssid ||  !uid){ throw new Error("NULL_PARAM") }; // reject request if any params are null
        const db = await getDB();
        const devices = db.collection<deviceInterface>("devices")
        
        // fetch the device in db for some basic checks
        let deviceForConfirmation = await devices.findOne<deviceInterface>({
            deviceUID:uid
        })
        
        if(!deviceForConfirmation) { throw new Error("NO_RECORD")}; // check it actually exists
        if(hmac(deviceForConfirmation.psk,uid) !== signature) {throw new Error("BAD_SIG")}; // verify signature
        if(deviceForConfirmation.registed) { throw new Error("ALREADY_REGISTED") }; // checks if registerd

        await devices.updateOne({deviceUID: uid},{
            $set:{
                ssid: ssid,
                publicIP: publicIP,
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            error: e
        })
    }
}

export {
    register
};