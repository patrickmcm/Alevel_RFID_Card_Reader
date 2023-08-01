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


    
    // reject request if any params are null
    if (!ssid ||  !uid){
        return res.status(httpStatus.BAD_REQUEST).json({
            sucess: false,
            dbMessage: null,
            serverMessage: "NULL_PARAM"
        })
    }

    
    try {
        const db = await getDB();
        const devices = db.collection<deviceInterface>("devices")
        // recalculate the signature to check message authenticity
        let deviceForConfirmation = await devices.findOne<deviceInterface>({
            deviceUID:uid
        })
        if(!deviceForConfirmation){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                dbMessage: null,
                serverMessage: "NO_RECORD"
            })
        }

        if(hmac(deviceForConfirmation.psk,uid) !== signature){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                dbMessage: null,
                serverMessage: "BAD_SIG"
            })
        }
        console.log(deviceForConfirmation.registed)
        if(deviceForConfirmation.registed){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                dbMessage: null,
                serverMessage: "ALREADY_REGISTED"
            })
        }

        let device = await devices.updateOne({deviceUID: uid},{
            $set:{
                ssid: ssid,
                publicIP: publicIP,
            }
        })
        console.log(device)
    } catch(e) {
        console.log(e)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            dbMessage: e,
            serverMessage: "DB_FAILURE"
        })
    }

    res.send("the");
}

module.exports = { register };