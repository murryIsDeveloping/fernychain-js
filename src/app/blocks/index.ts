import express from "express";
import { P2pServer } from "../p2p";

export function blocksRouter(p2pServer: P2pServer) {
  const router = express.Router();

  router.get("/blocks", (req, res) => {
    res.send(p2pServer.blockchain.chain);
  });

  router.post("/mine", (req, res) => {
    p2pServer.blockchain.mineBlock(req.body);
    p2pServer.syncChain();
    res.send(p2pServer.blockchain.chain);
  });

  return router;
}
