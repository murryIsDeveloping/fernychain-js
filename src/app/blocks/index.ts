import express from "express";
import { BlockChain } from "./../../blockchain";

export function blocksRouter(blockchain: BlockChain) {
  const router = express.Router();

  router.get("/blocks", (req, res) => {
    res.send(blockchain.chain);
  });

  router.post("/mine", (req, res) => {
    blockchain.mineBlock(req.body);
    res.send(blockchain.chain);
  });

  return router;
}
