interface createUserBody {
    data: {
        email: string,
        password: string,
    }
}

interface userSchema {
    uid: string,
    deviceUIDs: string[],
    email: string,
    password: string
    registered: Date
}

declare module "express-session" {
    export interface SessionData {
        auth: boolean,
        data: {
            uid: string,
            email: string,
            deviceUIDs: string[]
        }
    }
}


export {
    createUserBody,
    userSchema
}