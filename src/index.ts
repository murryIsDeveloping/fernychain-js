import { BlockChain } from "./classes/blockchain";

const blockchain = new BlockChain()
blockchain.addBlock({
    to: '2143214214234',
    from: '1234214342142314',
    amount: 10
})
blockchain.printBlocks();