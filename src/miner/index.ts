import { TransactionPool } from "./../wallet/transaction-pool";
import { BlockChain } from "./../blockchain";
import { P2pServer } from "./../app/p2p";
import { Wallet } from "./../wallet/wallet";
import { Transaction } from "./../wallet/transactions";

export class Miner {
    constructor(
        public blockchain: BlockChain, 
        public pool: TransactionPool, 
        public wallet: Wallet, 
        public p2p: P2pServer
    ){ }

    public mine(){
        const validTransactions : Transaction[] = this.pool.validTransactions();
        // include reward for miner
        // create a block of valid transactions
        // sync chains in p2p server
        // clear trans pools
        

    }
}