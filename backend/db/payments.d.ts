interface createPayment {
    amount: number,
    deviceUID: string,  
}

interface paymentSchema {
    amount: number,
    deviceUID: string,
    deviceOwnerUID: string,
    created: Date,
    paid: Boolean,
    signature: string
}

export {
    createPayment
}