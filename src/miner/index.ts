import { TransactionPool } from "./../wallet/transaction-pool";
import { BlockChain, Block } from "./../blockchain";
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

    public mine() : Block {
        const validTransactions : Transaction[] = this.pool.validTransactions();
        validTransactions.push(Transaction.miningReward(this.wallet.publicKey, Wallet.blockChainWallet()));
        const block = this.blockchain.mineBlock(validTransactions)
        this.p2p.syncChain();
        this.p2p.syncClearPool();
        return block;
    }
}