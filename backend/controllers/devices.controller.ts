import { Request, Response } from 'express';
import deviceInterface  from '../db/devices.types';
import hmac from '../utils/hmac';
import httpStatus from 'http-status';
import getDB from '../db/connect';
import generateOTC from '../utils/generateOTC';
import { isValidNonce } from '../utils/validNonce';

/*
TASK: SETUP BASIC SIGNING AND COMMUNICATION BETWEEN CLIENT-SERVER

1. REQUEST INFORMATION FROM THE CLIENT
2. GENERATE CODE AND SEND BACK
3. SETUP ANOTHER ROUTE, ACCEPTS CODE AND CHANGE RECORD IN DB



*/



const register = async (req: Request, res: Response) => {
    const signature = req.body.signature;
    const nonce = req.body.data.nonce;
    const clientTimestamp = req.body.data.timestamp;
    const ssid = req.body.data.ssid;
    const uid = req.body.data.uid
    const publicIP = req.ip

    // data has to be submitted in the same order everytime btw

    try {
        if (!ssid ||  !uid){ throw new Error("NULL_PARAM") }; // reject request if any params are null
        const db = await getDB();
        const devices = db.collection<deviceInterface>("devices")
        
        // fetch the device in db for some basic checks
        let deviceForConfirmation = await devices.findOne<deviceInterface>({
            deviceUID:uid
        })
        
        const serverTimestamp = Math.round(Date.now()/1000)
        console.log(serverTimestamp)
        if(!deviceForConfirmation) { throw new Error("NO_RECORD")}; // check it actually exists
        isValidNonce(nonce) // check if valid nonce
        if((serverTimestamp-clientTimestamp)>5) { throw new Error("TIMEOUT") } // only accept 5s delay
        if(hmac(deviceForConfirmation.psk,JSON.stringify(req.body.data)+nonce) !== signature) {throw new Error("BAD_SIG")}; // verify signature
        if(deviceForConfirmation.registed) { throw new Error("ALREADY_REGISTED") }; // checks if registerd

        const otc = await generateOTC(devices)

        await devices.updateOne({deviceUID: uid},{
            $set:{
                ssid: ssid,
                publicIP: publicIP,
                otc: otc
            }
        })

        res.json({
            success:true,
            error:null,
            otc:otc
        })
    } catch(e:any) {
        console.log(e)
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            error: e.message
        })
    }
}




export {
    register
};