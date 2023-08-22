import { Request, Response } from 'express';

function renderDashboard(req: Request, res: Response) {

    res.send(req.body)

}

function renderDevices(req: Request, res: Response) {
    res.send(req.body);
}


function renderTransactions(req: Request, res: Response) {
    res.send(req.body);
}

function renderUsers(req: Request, res: Response) {
    res.send(req.body);
}

function renderLogin(req: Request, res: Response){
    req;
    res.render('pages/login')
}

function renderRegister(req: Request, res: Response){
    req;
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