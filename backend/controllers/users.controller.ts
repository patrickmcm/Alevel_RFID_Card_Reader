import { Request, Response } from 'express';
import { authUserBody, userSchema } from '../db/users.types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import getDB from '../db/connect';
import { config } from '../config';
import httpStatus from 'http-status';
import _ from 'lodash';

/*
ROUTES:

createUser, getUser

*/

async function createUser(req: Request, res: Response) {
    const body: authUserBody = req.body;
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
        const regDate = new Date();
        const newUser = await users.insertOne({
            email: body.data.email,
            uid: uid,
            deviceUIDs: [],
            password: await bcrypt.hash(body.data.password,config.app.saltRounds),
            registered: regDate
        })

        
        req.session.auth = true
        req.session.data = {
            uid: uid,
            email: body.data.email,
            deviceUIDs: [],
            registered: regDate
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
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            error: e.message
        })
    }
}

async function loginUser(req: Request, res: Response) {
    const loginUserBody: authUserBody = req.body

    try {
        const db = getDB();
        const users = db.collection<userSchema>('users');
        const user = await users.findOne({email: loginUserBody.data.email})

        if(!user) { throw new Error("USER_NOT_FOUND"); }

        const compareResult = await bcrypt.compare(loginUserBody.data.password,user.password)

        if(!compareResult) { throw new Error("BAD_PASS"); }

        req.session.auth = true
        req.session.data = _.pick(user,['uid','deviceUIDs','email','registered'])
        return res.json({
            success: true,
            error: null
        })
    } catch(e: any) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            error: e.message
        })
    }
}

export {
    createUser,
    loginUser
}