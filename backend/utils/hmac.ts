import crypto from "crypto"

function hmac(secret: string, data: string){
    return crypto.createHmac('sha256',secret).update(data).digest('hex')
}


export {
    hmac
};