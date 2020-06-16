import { genKeyPair } from "../util";
import { ec } from "elliptic";
import { Transaction } from "./transactions";
import { TransactionPool } from "./transaction-pool";

export class Wallet {
    public balance: number;
    public readonly keyPair: ec.KeyPair;
    public readonly publicKey: string;

    constructor(){
        this.balance = 100;
        this.keyPair = genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex', false);
    }

    public createTransaction(recipient: string, amount: number, transactionPool: TransactionPool){
        if( amount > this.balance) {
            throw new Error('Insufficent Balance')
        }

        let transaction = transactionPool.getTransaction(this.publicKey)

        if(transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = new Transaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
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