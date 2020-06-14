import express from "express";
import { BlockChain } from './../blockchain';
import { blocksRouter } from './blocks';

const app = express();
const blockchain = new BlockChain()
const PORT = process.env.PORT || 3000
app.use(express.json());
app.use(blocksRouter(blockchain))

app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`)
})