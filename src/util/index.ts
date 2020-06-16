import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');
import { v1 as uuidV1 } from 'uuid';
import * as crypto from 'crypto';

type StringifiedSignature = {   
    r: string,
    s: string,
    recoveryParam: number,
      
}

export function genKeyPair() : EC.KeyPair{
    return ec.genKeyPair()
}

export function uid() : string {
    return uuidV1();
}

export function hash(value: string): string {
    return crypto.createHmac('sha256', value).digest('hex');
}

export function verifySignature(publicKey: string, signature: string, dataHash: string): boolean {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
}