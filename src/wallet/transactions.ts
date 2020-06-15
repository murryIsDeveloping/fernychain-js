import { uid } from "./../util/chain"
import { Wallet } from "./wallet"

type Output = {
    amount: number,
    address: string
}

export class Transaction {
    public readonly id: string 
    public outputs: Output[] = [];

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

        return transaction;
    }
}