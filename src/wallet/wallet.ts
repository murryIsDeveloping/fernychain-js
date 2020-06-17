import { genKeyPair } from "../util";
import { ec } from "elliptic";
import { Transaction } from "./transactions";
import { TransactionPool } from "./transaction-pool";
import { CURRENCY_CAP } from "../config";
import { BlockChain } from "./../blockchain";

export class Wallet {
    public readonly keyPair: ec.KeyPair;
    public readonly publicKey: string;

    private constructor(public balance: number, isBlockchain = false){
        this.keyPair = genKeyPair(isBlockchain);
        this.publicKey = this.keyPair.getPublic().encode('hex', false);
    }

    public createTransaction(recipient: string, amount: number, transactionPool: TransactionPool, blockchain: BlockChain){
        this.calculateBalance(blockchain);

        if( amount > this.balance) {
            throw new Error('Insufficent Balance')
        }

        let transaction = transactionPool.getTransaction(this.publicKey)

        if(transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.create(this, recipient, amount);
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

    public calculateBalance(blockchain: BlockChain): number {
        let lastTransaction: Transaction | undefined
        let total = 0;

        for (let i = blockchain.chain.length - 1; i >= 0; i--) {
            let block = blockchain.chain[i];
            for(let transaction of block.value) {
                if(transaction.input.address === this.publicKey) {
                    lastTransaction = transaction;
                } else {
                    total += transaction.outputs.reduce((amount, output) => {
                        return output.address === this.publicKey ? amount + output.amount : amount
                    }, 0);
                }
            }

            if(lastTransaction) {
                break;
            }
        }

        if(lastTransaction){
            let walletOutput = lastTransaction.outputs.find(o => o.address === this.publicKey);
            if(walletOutput){
                this.balance = total + walletOutput.amount
                return this.balance;
            }
        }

        this.balance = total;
        return this.balance;
    }

    static userWallet(){
        return new this(0)
    }

    static blockChainWallet(){
        return new this(CURRENCY_CAP, true)
    }
}