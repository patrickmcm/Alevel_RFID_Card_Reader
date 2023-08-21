interface authUserBody {
    data: {
        email: string,
        name: string
        password: string,
    }
}


interface userSchema {
    uid: string,
    deviceUIDs: string[],
    email: string,
    password: string
    registered: Date,
    name: string
}

declare module "express-session" {
    export interface SessionData {
        auth: boolean,
        data: {
            uid: string,
            email: string,
            deviceUIDs: string[],
            registered: Date,
            name: string
        }
    }
}


export {
    authUserBody,
    userSchema
}