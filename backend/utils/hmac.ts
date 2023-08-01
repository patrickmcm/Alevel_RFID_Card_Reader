import crypto from "crypto"

export default function hmac(secret: string, data: string){
    return crypto.createHmac('sha256',secret).update(data).digest('hex')
}

