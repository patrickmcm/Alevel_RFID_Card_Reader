interface deviceSchema {
    ssid: string,
    deviceUID: string,
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
        otc: string
    }
}

export {
    deviceSchema,
    registerBody
}