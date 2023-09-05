import { Request, Response } from 'express';
import getDB from '../../db/connect';
import { deviceSchema } from '../../db/devices';
import _ from 'lodash';

async function renderDashboard(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    let userDevices: object[] = []
    try{
        const db = getDB();
        const devices = db.collection<deviceSchema>('devices');

        const userDevicesCursor = devices.find<deviceSchema>({
            registeredUserUID: req.session.data?.uid
        })
        
        for await (const doc of userDevicesCursor) {
            userDevices.push(_.omit(doc,['_id']));
        } 
    } catch(e) {
        userDevices.push({err:true})
    }

    res.render('index',{data:req.session, devices: userDevices})
}

async function renderDevices(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    let userDevices: object[] = []
    try{
        const db = getDB();
        const devices = db.collection<deviceSchema>('devices');

        const userDevicesCursor = devices.find<deviceSchema>({
            registeredUserUID: req.session.data?.uid
        })
        
        for await (const doc of userDevicesCursor) {
            userDevices.push(_.omit(doc,['_id']));
        } 
    } catch(e) {
        userDevices.push({err:true})
    }


    res.render('pages/devices',{data:req.session, devices:userDevices})
}


function renderTransactions(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    res.render('pages/transactions',req.session)
}

function renderUsers(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    res.render('pages/users', req.session)
}

function renderLogin(req: Request, res: Response){
    if(req.session.auth) return res.redirect('/')

    res.render('pages/login')
}

function renderRegister(req: Request, res: Response){
    if(req.session.auth) return res.redirect('/')

    res.render('pages/register')
}

export {
    renderDashboard,
    renderDevices,
    renderTransactions,
    renderUsers,
    renderLogin,
    renderRegister
}