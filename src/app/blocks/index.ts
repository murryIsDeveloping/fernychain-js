import express from "express";
import { Miner } from "./../../miner";

export function blocksRouter(miner: Miner) {
  const router = express.Router();

  router.get("/blocks", (req, res) => {
    res.send(miner.blockchain.chain);
  });

  router.get("/mine", (req, res) => {
    const block = miner.mine();
    res.send(block)
  });

  return router;
}
