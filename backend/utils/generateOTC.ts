import crypto from 'node:crypto'
import deviceInterface from '../db/devices.types'
import { Collection } from 'mongodb'

async function generateOTC(devices:Collection<deviceInterface>) {
    const array = new Uint8Array(6)
    crypto.webcrypto.getRandomValues(array)
    let otc = ""
    for (const num of array) {
        otc += num
    }
    otc = otc.slice(0,6)

    try {
        const device = await devices.findOne({otc:otc})
        if(device){
            otc = await generateOTC(devices)
        }
    } catch (e){
        console.log(e)
    }
    return otc
}

export default generateOTC;