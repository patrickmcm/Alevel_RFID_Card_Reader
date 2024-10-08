import crypto from 'node:crypto'
import {deviceSchema} from '../db/devices'
import { Collection } from 'mongodb'

async function generateOTC(devices:Collection<deviceSchema>) {
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