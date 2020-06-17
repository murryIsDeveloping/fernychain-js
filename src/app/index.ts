import express from "express";
import { BlockChain } from './../blockchain';
import { blocksRouter } from './blocks';
import { P2pServer } from "./p2p";
import { TransactionPool } from "./../wallet/transaction-pool";
import { Wallet } from "./../wallet/wallet";
import { transactionRouter } from "./transactions";
import { Miner } from "./../miner";

const app = express();
const blockchain = new BlockChain()
const pool = new TransactionPool()
const wallet = Wallet.userWallet()
const p2p = new P2pServer(blockchain, pool)
const miner = new Miner(blockchain, pool, wallet, p2p)


const PORT = process.env.PORT || 3000
const WS_PORT = process.env.WS_PORT || 5001

app.use(express.json());
app.use(blocksRouter(miner));
app.use(transactionRouter(p2p, wallet))

p2p.listen(Number(WS_PORT));
app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`)
})