import { uid, hashString } from "../util"
import { Wallet } from "./wallet"
import { ec } from "elliptic";

type Output = {
    amount: number,
    address: string
}

type Input = {
    timestamp: number,
    amount: number,
    address: string,
    signature: ec.Signature
}

export class Transaction {
    public readonly id: string 
    public outputs: Output[] = [];
    public input: Input | undefined;

    constructor(){
        this.id = uid()
    }

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number): Transaction | Error {
        const transaction = new Transaction()

        if (amount > senderWallet.balance) {
            return new Error(`Amount: ${ amount } exceeds balance.`); 
        }

        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount: amount, address: recipient },
        ])

        Transaction.signTransaction(transaction, senderWallet)

        return transaction;
    }

    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(hashString(transaction.outputs.toString()))
        }
    }
}