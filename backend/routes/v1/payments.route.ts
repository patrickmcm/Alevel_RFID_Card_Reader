import { Router } from "express";
import { createPayment } from "../../controllers/payments.controller";

const routerPayments = Router();

// controllers



routerPayments.post('/payment',createPayment);


export {
    routerPayments
};