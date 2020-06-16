import { Transaction } from "./transactions"

export class TransactionPool {
    transactions: Transaction[] = [];

    constructor() {
        this.transactions = []
    }

    public updateOrAddTransaction(transaction: Transaction) {
        let transactionWithIdIndex = this.transactions.findIndex(t => t.id === transaction.id);
        if(transactionWithIdIndex >= 0) {
            this.transactions[transactionWithIdIndex] = transaction;
        } else {
            this.transactions.push(transaction)
        }

    }
}