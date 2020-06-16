import { Transaction } from "./transactions";
import { Wallet } from "./wallet";
import { TransactionPool } from "./transaction-pool";

describe('Transaction Pool', () => {
    let transaction: Transaction;
    let wallet: Wallet;
    let pool: TransactionPool

    beforeEach(() => {
        wallet = new Wallet();
        transaction = new Transaction(wallet, "randomaddress", 50);
        pool = new TransactionPool();
    });

    test('will add a transaction to the transaction pool', () => {
        pool.updateOrAddTransaction(transaction)
        expect(pool.transactions.length).toEqual(1);
        expect(pool.transactions[0]).toEqual(transaction)
    })

    test('will update a transaction if id matches id in pool', () => {
        // pass a clone of the transaction
        pool.updateOrAddTransaction(JSON.parse(JSON.stringify(transaction)))
        expect(pool.transactions.length).toEqual(1);
        expect(pool.transactions[0].outputs.length).toEqual(2);
        // update the transaction with an additional transaction
        transaction.update(wallet, "anotherAddress", 10);
        // add the new transaction 
        pool.updateOrAddTransaction(transaction);
        // expect the transaction to be updated
        expect(pool.transactions.length).toEqual(1);
        expect(pool.transactions[0]).toEqual(transaction)
        expect(pool.transactions[0].outputs.length).toEqual(3);
    })
})