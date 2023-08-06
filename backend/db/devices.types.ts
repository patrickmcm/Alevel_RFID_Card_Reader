interface deviceInterface {
    ssid: string,
    deviceUID: string,
    otc: string,
    publicIP: string,
    psk: string,
    registedUserUID: string,
    registed: boolean,
    lastHash: string
}

interface registerBody {
    signature: string,
    data: {
        otc: string,
        uid: string,
        nonce: string,
    }
}

export {
    deviceInterface,
    registerBody
}