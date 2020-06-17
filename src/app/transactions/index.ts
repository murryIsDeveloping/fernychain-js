import express from "express";
import { P2pServer } from "../p2p";
import { Wallet } from "./../../wallet/wallet";

export function transactionRouter(p2pServer: P2pServer, wallet: Wallet) {
  const router = express.Router();

  router.get("/transactions", (req, res) => {
    res.send(p2pServer.pool.validTransactions());
  });

  router.get("/public-key", (req, res) => {
    res.send({
      address: wallet.publicKey
    });
  });

  router.post("/transaction", (req, res) => {
    const transaction = wallet.createTransaction(req.body.address, req.body.amount, p2pServer.pool)
    p2pServer.syncTransactions(transaction)
    res.redirect('/transactions')
  });

  return router;
}
