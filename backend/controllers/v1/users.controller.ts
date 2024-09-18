import { Request, Response } from 'express';
import { authUserBody, userSchema } from '../../db/users';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import getDB from '../../db/connect';
import { config } from '../../config';
import httpStatus from 'http-status';
import _ from 'lodash';
import ApiError from '../../utils/apiError';

/*
ROUTES:

createUser, getUser

*/

async function createUser(req: Request, res: Response) {
    const body: authUserBody = req.body;
    console.log(body)
    try {
        if (req.session.auth){
            throw new ApiError(httpStatus.FORBIDDEN,"LOGGED_IN")
        }

        if(!body.data?.email) {
            throw new ApiError(httpStatus.BAD_REQUEST,"NULL_PARAMS")
        } 

        const db = await getDB()
        const users = db.collection<userSchema>('users')

        const user = await users.findOne({
            email: body.data.email
        })

        if(user) {
            throw new ApiError(httpStatus.CONFLICT,"ALREADY_EXISTS")
        }

        const uid = uuidv4();
        const regDate = new Date();
        const newUser = await users.insertOne({
            email: body.data.email,
            uid: uid,
            deviceUIDs: [],
            password: await bcrypt.hash(body.data.password,config.app.saltRounds),
            registered: regDate,
            username: body.data.username
        })

        
        req.session.auth = true
        req.session.data = {
            uid: uid,
            email: body.data.email,
            deviceUIDs: [],
            registered: regDate,
            username: body.data.username
        }

        return res.json({
            success: true,
            error: null,
            data: {
                newUser
            }
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

async function loginUser(req: Request, res: Response) {
    const loginUserBody: authUserBody = req.body

    try {
        if (req.session.auth){
            throw new ApiError(httpStatus.FORBIDDEN,"LOGGED_IN")
        }

        const db = getDB();
        const users = db.collection<userSchema>('users');
        const user = await users.findOne({email: loginUserBody.data.email})

        if(!user) { throw new ApiError(httpStatus.NOT_FOUND,"USER_NOT_FOUND"); }

        const compareResult = await bcrypt.compare(loginUserBody.data.password,user.password)

        if(!compareResult) { throw new ApiError(httpStatus.UNAUTHORIZED,"BAD_PASS"); }

        req.session.auth = true
        req.session.data = _.pick(user,['uid','deviceUIDs','email','registered','username'])
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

function logoutUser(req: Request,res: Response) {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

export {
    createUser,
    loginUser,
    logoutUser
}