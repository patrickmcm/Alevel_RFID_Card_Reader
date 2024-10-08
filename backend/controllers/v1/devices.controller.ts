import { Request, Response } from 'express';
import {deviceSchema, registerBody}  from '../../db/devices';
import hmac from '../../utils/hmac';
import httpStatus from 'http-status';
import getDB from '../../db/connect';
import generateOTC from '../../utils/generateOTC';
import { isValidNonce } from '../../utils/validNonce';
import { userSchema } from '../../db/users';
import ApiError from '../../utils/apiError';
import { IncomingMessage } from 'http';
import { wsServer } from '../../app';
import { WebSocket } from "ws";


/*
TASK: SETUP BASIC SIGNING AND COMMUNICATION BETWEEN CLIENT-SERVER

1. REQUEST INFORMATION FROM THE CLIENT
2. GENERATE CODE AND SEND BACK
3. SETUP ANOTHER ROUTE, ACCEPTS CODE AND CHANGE RECORD IN DB


6th august:
1. create user routes. and user types
2. create register route


*/

async function registerDevice(req: Request, res: Response) {
    const registerBody: registerBody = req.body

    try {
        if(registerBody.authKey) {
            // do api key stuff
        } else if (!req.session.auth){
            throw new ApiError(httpStatus.UNAUTHORIZED,"NO_AUTH")
        } else if (!req.session.data){
            throw new ApiError(httpStatus.BAD_REQUEST,"MAL_SESS")
        }

        // now auth
        const db = getDB()
        const users = db.collection<userSchema>('users');
        const devices = db.collection<deviceSchema>('devices');

        const device = await devices.findOne({
            otc: registerBody.data.otc
        })

        // check if data.location and data.name are present, if not throw ApiError
        if(!registerBody.data.name || !registerBody.data.location) {
            throw new ApiError(httpStatus.BAD_REQUEST,"NULL_PARAMS");
        }



        if(!device) {
            throw new ApiError(httpStatus.BAD_REQUEST,"BAD_CODE");
        } else if (device.registered){
            throw new ApiError(httpStatus.CONFLICT,"ALR_REG")
        }

        await devices.updateOne({otc: registerBody.data.otc}, 
            {$set: {registered: true,registeredUserUID: req.session.data?.uid, location: registerBody.data.location, name: registerBody.data.name}
        })

        users.updateOne(
            {uid: req.session.data?.uid}, 
            {$push: {deviceUIDs: device.deviceUID}
        })

        return res.json({
            success: true,
            error: null
        })
    } catch (e: any) {
        if(e instanceof ApiError) {
            return res.status(e.statusCode).json({
                success: false,
                error: e.message
            })

        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: httpStatus[500]
        });
    }
}

async function getRegStatus(req: Request, res:Response) {
    const deviceUID = req.query.uid;
    try {
        req.session.destroy(() => {})
        const db = await getDB();
        const devices = db.collection<deviceSchema>("devices");

        // fetch the device in db for some basic checks
        let regCheckDevice = await devices.findOne<deviceSchema>({
            deviceUID: deviceUID
        });

        if(!regCheckDevice){
            throw new ApiError(httpStatus.NOT_FOUND,"NOT_FOUND")
        }

        
        return res.json({
            success: true,
            registered: regCheckDevice.registered
        })

    } catch (e: any) {
        if(e instanceof ApiError) {
            return res.status(e.statusCode).json({
                success: false,
                error: e.message
            })
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: httpStatus[500]
        });
    }

}

async function requestOTC(req: Request, res: Response) {
    const signature: string = req.body.signature;
    const nonce: string = req.body.data.nonce;
    const clientTimestamp: number = req.body.data.timestamp;
    const ssid: string = req.body.data.ssid;
    // data has to be submitted in the same order everytime btw
    try {
        if (!req.body.data.uid) { throw new ApiError(httpStatus.BAD_REQUEST,"NULL_PARAM"); }; // expand this to make it clear which error

        const db = await getDB();
        const devices = db.collection<deviceSchema>("devices");

        // fetch the device in db for some basic checks
        let deviceForConfirmation = await devices.findOne<deviceSchema>({
            deviceUID: req.body.data.uid
        });


        const serverTimestamp = Math.round(Date.now() / 1000);
        if (!deviceForConfirmation) { throw new ApiError(httpStatus.NOT_FOUND,"NO_RECORD"); }; // check it actually exists
        if (!isValidNonce(nonce)) { throw new ApiError(httpStatus.BAD_REQUEST,"INVLD_NONCE") } // check if valid nonce
        
        if ((serverTimestamp - clientTimestamp) > 10) { throw new ApiError(httpStatus.REQUEST_TIMEOUT,"TIMEOUT"); } // only accept 5s delay
        if (hmac(deviceForConfirmation.psk, JSON.stringify(req.body.data)) !== signature) { throw new ApiError(httpStatus.BAD_REQUEST,"BAD_SIG"); }; // verify signature

        const otc = await generateOTC(devices);

        await devices.updateOne({ deviceUID: req.body.data.uid }, {
            $set: {
                ssid: ssid,
                publicIP: req.ip,
                otc: otc
            }
        });

        // why i do this is to let the ssid & ip be updated IF they have switched wifi's 
        if (deviceForConfirmation.registered) { throw new ApiError(httpStatus.CONFLICT,'ALR_REG'); }; // checks if registerd

        console.log(`[!] Device ${req.body.data.uid} successfully requested an OTC!`);
        console.log(`Device Info:`);
        console.log(`- Device UID: ${req.body.data.uid}`);
        console.log(`- SSID: ${ssid}`);
        console.log(`- Public IP: ${req.ip}`);
        console.log(`- OTC: ${otc}`);
        // log the device info
        
        return res.json({
            success: true,
            error: null,
            otc: otc
        });
    } catch (e: any) {
        if(e instanceof ApiError) {
            console.log(`[!] Device ${req.body.data.uid || "NO_UID"} failed request for OTC because ${e.message}`);
            return res.status(e.statusCode).json({
                success: false,
                error: e.message
            })
        }
        console.log(`[!] Device ${req.body.data.uid || "NO_UID"} failed request for OTC because ${e.message}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: httpStatus[500]
        });
    }
}

async function heartbeat(socket:WebSocket,request:IncomingMessage) {
    // we have already authenticated the device here so have confidence in the data recieved
    wsServer.on('error', console.error)

    socket.on('message', (message:Buffer) => {
        let msg = "";
        for (let index = 0; index < message.length; index++) {
            msg += String.fromCharCode(message[index])
        }
        console.log(msg)
    })

    socket.on('close', () => {
        console.log("client disconnected")
        console.log("their data: ")
        console.log(request.headers)
    })

}





export {
    requestOTC,
    registerDevice,
    getRegStatus,
    heartbeat
};