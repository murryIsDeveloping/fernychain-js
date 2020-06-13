import { BlockChain } from "./blockchain";
import { GenisisBlock, Block } from "./block";

describe("Blockchain", () => {
  Date.now = jest.fn(() => 12345);

  const blockchain = new BlockChain();
  test("Creates a Blockchain with a Genisis block", () => {
    expect(blockchain.currentBlock()).toEqual(new GenisisBlock());
  });

  test("Add to blockchain", () => {
    const value = { to: "1", from: "2", amount: 100 };
    const genisis = new GenisisBlock();
    const block = new Block(genisis.hash, value);
    blockchain.addBlock(value);
    expect(blockchain.currentBlock()).toEqual(block);
  });
});
