import { genKeyPair } from "../util";
import { ec } from "elliptic";

export class Wallet {
    public balance: number;
    public readonly keyPair: ec.KeyPair;
    public readonly publicKey: string;

    constructor(){
        this.balance = 100;
        this.keyPair = genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex', false);
    }

    public sign(dataHash: string): ec.Signature {
        return this.keyPair.sign(dataHash);
    }

    public toString() : string {
        return `Wallet
            public-key: ${this.publicKey}
            balance: ${this.balance}
        `
    }
}