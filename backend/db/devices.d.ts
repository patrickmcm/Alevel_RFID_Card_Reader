interface deviceSchema {
    ssid: string,
    deviceUID: string,
    name: string,
    location: string,
    otc: string,
    publicIP: string,
    psk: string,
    registeredUserUID: string,
    registered: boolean,
    lastHash: string
}

interface registerBody {
    authKey?: string
    data: {
        otc: string,
        name: string,
        location: string
    }
}

export {
    deviceSchema,
    registerBody
}