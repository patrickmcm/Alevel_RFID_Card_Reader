import { Router } from "express";
import { createPayment } from "../../controllers/v1/payments.controller";

const routerPayments = Router();

// controllers



routerPayments.post('/payment',createPayment);


export {
    routerPayments
};