import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');
import { v1 as uuidV1 } from 'uuid';
import * as crypto from 'crypto';

export function genKeyPair() : EC.KeyPair{
    return ec.genKeyPair()
}

export function uid() : string {
    return uuidV1();
}

export function hash(timestamp: number, value: string): string {
    return crypto.createHmac('sha256', timestamp.toString())
            .update(value)
            .digest('hex');
}

export function hashString(value: string): string {
    return crypto.createHmac('sha256', value).digest('hex');
}