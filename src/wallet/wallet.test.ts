import { Wallet } from "./wallet"
import { TransactionPool } from "./transaction-pool"
import { Transaction } from "./transactions"

describe('Wallet', () => {
    let wallet : Wallet
    let pool : TransactionPool

    beforeEach(() => {
        wallet = new Wallet()
        pool = new TransactionPool()
    })

    describe('creating a transaction', () => {
        let transaction: Transaction, sendAmount: number, recipient: string;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'address';
            transaction = wallet.createTransaction(recipient, sendAmount, pool);
        })

        describe('doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, pool);
            })

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey)?.amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount])
            })
        })
    })
})