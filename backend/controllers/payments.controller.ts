import { Request, Response } from 'express';


function createPayment(req: Request, res: Response) {
    /* 
    create payment in db then emit an event for a websocket to handle it and send to client

    on client then do following:
        1. display amount to pay
        2. card taps, send uid to server along with last transaction id on card
        3. check last transaction id on cards db, if mismatch then decline & lock card
        4. if good, return accepted and allow card then on server write stuff to db.


        OTHER THINGS:

        fix the error handling man 😭😭, rn its just the same status code for everything which is so confusing
    */

}