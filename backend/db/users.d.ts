interface authUserBody {
    data: {
        email: string,
        username: string
        password: string,
    }
}


interface userSchema {
    uid: string,
    deviceUIDs: string[],
    email: string,
    password: string
    registered: Date,
    username: string
}

declare module "express-session" {
    export interface SessionData {
        auth: boolean,
        data: {
            uid: string,
            email: string,
            deviceUIDs: string[],
            registered: Date,
            username: string
        }
    }
}


export {
    authUserBody,
    userSchema
}