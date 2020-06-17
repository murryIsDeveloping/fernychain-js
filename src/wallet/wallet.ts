import { genKeyPair } from "../util";
import { ec } from "elliptic";
import { Transaction } from "./transactions";
import { TransactionPool } from "./transaction-pool";
import { INITIAL_BALANCE, CURRENCY_CAP } from "../config";

export class Wallet {
    public readonly keyPair: ec.KeyPair;
    public readonly publicKey: string;

    private constructor(public balance: number, isBlockchain = false){
        this.keyPair = genKeyPair(isBlockchain);
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

    static userWallet(){
        return new this(INITIAL_BALANCE)
    }

    static blockChainWallet(){
        return new this(CURRENCY_CAP, true)
    }
}