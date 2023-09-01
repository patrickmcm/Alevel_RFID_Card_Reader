import { Request, Response } from 'express';

function renderDashboard(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    res.render('index',req.session)
}

function renderDevices(req: Request, res: Response) {
    if(!req.session.auth) return res.redirect('/login')

    


    res.render('pages/devices',{data:req.session, devices:})
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