import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');
import { v1 as uuidV1 } from 'uuid';

export function genKeyPair() : EC.KeyPair{
    return ec.genKeyPair()
}

export function uid() : string {
    return uuidV1();
}