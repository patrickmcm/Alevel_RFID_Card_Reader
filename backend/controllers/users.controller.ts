import { Request, Response } from 'express';
import { createUserBody, userSchema } from '../db/users.types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import getDB from '../db/connect';
import { config } from '../config';

/*
ROUTES:

createUser, getUser

*/

async function createUser(req: Request, res: Response) {
    const body: createUserBody = req.body;
    try {
        if (req.session.auth){
            throw new Error("LOGGED_IN")
        }

        if(!body.data?.email) {
            throw new Error("NULL_PARAMS")
        } 

        const db = await getDB()
        const users = db.collection<userSchema>('users')

        const user = await users.findOne({
            email: body.data.email
        })

        if(user) {
            throw new Error("ALREADY_EXISTS")
        }

        const uid = uuidv4();
        const newUser = await users.insertOne({
            email: body.data.email,
            uid: uid,
            deviceUIDs: [],
            password: await bcrypt.hash(body.data.password,config.app.saltRounds),
            registered: new Date()
        })

        
        req.session.auth = true
        req.session.data = {
            uid: uid,
            email: body.data.email,
            deviceUIDs: []
        }

        return res.json({
            success: true,
            error: null,
            data: {
                newUser
            }
        })
    } catch(e: any) {
        console.log(e.message)
        return res.json({
            success: false,
            error: e.message
        })
    }


}

export {
    createUser
}