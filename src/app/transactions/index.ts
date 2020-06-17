import express from "express";
import { P2pServer } from "../p2p";
import { Wallet } from "./../../wallet/wallet";

export function transactionRouter(p2pServer: P2pServer, wallet: Wallet) {
  const router = express.Router();

  router.get("/transactions", (req, res) => {
    res.send(p2pServer.pool.validTransactions());
  });

  router.get("/wallet", (req, res) => {
    wallet.calculateBalance(p2pServer.blockchain);
    res.send({
      address: wallet.publicKey,
      balance: wallet.balance
    });
  });

  router.post("/transaction", (req, res) => {
    const transaction = wallet.createTransaction(req.body.address, req.body.amount, p2pServer.pool, p2pServer.blockchain)
    p2pServer.syncTransactions(transaction)
    res.redirect('/transactions')
  });

  return router;
}
