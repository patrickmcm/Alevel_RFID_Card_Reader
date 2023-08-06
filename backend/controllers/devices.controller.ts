import { Request, Response } from 'express';
import {deviceInterface, registerBody}  from '../db/devices.types';
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


6th august:
1. create user routes. and user types
2. create register route


*/

async function register(req: Request, res: Response) {
    const registerBody: registerBody = req.body

    res.send(registerBody)
}

async function requestOTC(req: Request, res: Response) {
    const signature: string = req.body.signature;
    const nonce: string = req.body.data.nonce;
    const clientTimestamp: number = req.body.data.timestamp;
    const ssid: string = req.body.data.ssid;
    // data has to be submitted in the same order everytime btw
    try {
        if (!ssid || !req.body.data.uid) { throw new Error("NULL_PARAM"); }; // reject request if any params are null
        const db = await getDB();
        const devices = db.collection<deviceInterface>("devices");

        // fetch the device in db for some basic checks
        let deviceForConfirmation = await devices.findOne<deviceInterface>({
            deviceUID: req.body.data.uid
        });

        const serverTimestamp = Math.round(Date.now() / 1000);
        if (!deviceForConfirmation) { throw new Error("NO_RECORD"); }; // check it actually exists
        isValidNonce(nonce); // check if valid nonce
        if ((serverTimestamp - clientTimestamp) > 10) { throw new Error("TIMEOUT"); } // only accept 5s delay
        if (hmac(deviceForConfirmation.psk, JSON.stringify(req.body.data) + nonce) !== signature) { throw new Error("BAD_SIG"); }; // verify signature
        if (deviceForConfirmation.registed) { throw new Error("ALREADY_REGISTED"); }; // checks if registerd

        const otc = await generateOTC(devices);

        await devices.updateOne({ deviceUID: req.body.data.uid }, {
            $set: {
                ssid: ssid,
                publicIP: req.ip,
                otc: otc
            }
        });

        return res.json({
            success: true,
            error: null,
            otc: otc
        });
    } catch (e: any) {
        // please do nice formatting maybe if you have time??
        console.log(`[!] Device ${req.body.data.uid} failed request for OTC because ${e.message}`);
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            error: e.message
        });
    }
}




export {
    requestOTC,
    register
};