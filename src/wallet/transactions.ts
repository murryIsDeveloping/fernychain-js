import { uid, hash, verifySignature } from "../util"
import { Wallet } from "./wallet"
import { MINING_REWARD, CURRENCY_CAP } from "./../config"

type Output = {
    readonly amount: number,
    readonly address: string
}

type Input = {
    readonly timestamp: number,
    readonly amount: number,
    readonly address: string,
    readonly signature: string
}

export class Transaction {
    public readonly id: string 
    public outputs: Output[] = [];
    public input: Input;

    private constructor(senderWallet: Wallet, recipient: string, amount: number, genisis = false){
        this.id = genisis ? 'Genisis' : uid();
        if (amount > senderWallet.balance) {
            throw new Error(`Amount: ${ amount } exceeds balance.`); 
        }

        this.outputs = genisis ? Transaction.genisisOutput(senderWallet) : Transaction.outputs(senderWallet, recipient, amount)
        
        this.input = Transaction.signTransaction(this.outputs, senderWallet)
    }

    static verifyTransaction(transaction: Transaction): boolean | Error {
        if(transaction.input){
            return verifySignature(transaction.input.address, transaction.input.signature, hash(JSON.stringify(transaction.outputs)))
        } else {
            return Error('No transaction Inputs')
        }
    }
    
    static signTransaction(outputs: Output[], senderWallet: Wallet): Input {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(hash(JSON.stringify(outputs))).toDER('hex')
        }
    }

    public update(senderWallet: Wallet, recipient: string, amount: number){
        const senderIndex = this.outputs.findIndex(output => output.address === senderWallet.publicKey);
        const sender = this.outputs[senderIndex];

        if(senderIndex < 0) {
            throw new Error(`Sender Wallet does not have an output`); 
        }

        if (amount > sender.amount) {
            throw new Error(`Amount: ${ amount } exceeds balance.`); 
        }

        const senderOutput = {
            amount: sender.amount - amount,
            address: sender.address
        }

        this.outputs[senderIndex] = senderOutput;
        
        this.outputs.push({ amount, address: recipient });
        this.input = Transaction.signTransaction(this.outputs, senderWallet);
    }

    static genisisOutput(wallet: Wallet):  Output[] {
        return [
            { amount: CURRENCY_CAP, address: wallet.publicKey }
        ];
    }

    static outputs(senderWallet: Wallet, recipient: string, amount: number): Output[] {
        return [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount: amount, address: recipient },
        ];
    }

    static genisisTransaction(blockcahinWallet: Wallet){
        return new Transaction(blockcahinWallet, '', 0, true)
    }

    static create(senderWallet: Wallet, recipient: string, amount: number){
        return new Transaction(senderWallet, recipient, amount)
    }

    static miningReward(minerAddress: string, blockchainWallet: Wallet){
        return new Transaction(blockchainWallet, minerAddress, MINING_REWARD);
    }
}