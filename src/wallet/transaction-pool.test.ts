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

    describe('valid and invalid transaction', () => {
        let transactionsLength = 10

        beforeEach(() => {
            for (let i = 0; i < transactionsLength; i++) {
                if(i%2 === 0) {
                   let valid = new Transaction(new Wallet(), `Address-${i}`, 10)
                   pool.updateOrAddTransaction(valid)
                } else {
                    let invalid = JSON.parse(JSON.stringify(new Transaction(new Wallet(), `Address-${i}`, 10)));
                    // randomly change the amount sent or change the address
                    Math.random() > 0.5 ? invalid.outputs[0].amount = 20 : invalid.outputs[0].address = 'HackedAddress'
                    pool.updateOrAddTransaction(invalid)
                }
            }
        });

        test('will filter to only valid transactions', () => {
            expect(pool.transactions.length).toEqual(transactionsLength)
            expect(pool.validTransactions().length).toEqual(transactionsLength/2)
        })
    })
})