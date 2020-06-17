import { Transaction } from "./transactions"

export class TransactionPool {
    transactions: Transaction[] = [];

    constructor() {
        this.transactions = []
    }

    public clearPool(){
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

    public getTransaction(address: string) : Transaction | undefined {
        return this.transactions.find(t => t.input.address === address)
    }

    public validTransactions(): Transaction[] {
        return this.transactions.filter(trans => {
            const outputTotal = trans.outputs.reduce((total, output) => output.amount + total, 0);
            if (trans.input.amount !== outputTotal) {
                return false;
            }

            if (!Transaction.verifyTransaction(trans)) {
                return false
            }

            return true
        });
    }
}