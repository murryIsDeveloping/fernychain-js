import { BlockChain } from "./blockchain";
import { GenisisBlock, Block } from "./block";

describe("Blockchain", () => {
  // mock date now function
  Date.now = jest.fn(() => 12345);

  let blockchain = new BlockChain();

  beforeEach(() => {
    blockchain = new BlockChain();
  })

  test("Creates a Blockchain with a Genisis block", () => {
    expect(blockchain.currentBlock()).toEqual(new GenisisBlock());
  });

  test("Add to blockchain", () => {
    const value = { to: "1", from: "2", amount: 100 };
    const genisis = new GenisisBlock();
    const block = new Block(genisis, value);
    blockchain.mineBlock(value);
    expect(blockchain.currentBlock()).toEqual(block);
  });

  test("Validate valid blockchain", () => {
    blockchain.mineBlock({ to: "1", from: "2", amount: 100 })
    let invalid =  BlockChain.validateChain(blockchain.chain);
    expect(invalid).toBe(true)
  })

  test("Validate invalid blockchain", () => {
    blockchain.mineBlock({ to: "1", from: "2", amount: 100 })
    blockchain.currentBlock().value = { to: "1", from: "2", amount: 200 }
    let invalid =  BlockChain.validateChain(blockchain.chain);
    expect(invalid).toBe(false)
  })


  test("Keep current chain if longer than new chain", () => {
    const newChain = new BlockChain()
    const value = { to: "1", from: "2", amount: 100 };
    blockchain.mineBlock(value)
    blockchain.replaceChain(newChain.chain);
    
    expect(blockchain).not.toEqual(newChain)
  })

  test("Update chain if new chain is longer", () => {
    const newChain = new BlockChain()
    const value = { to: "1", from: "2", amount: 100 };
    blockchain.mineBlock(value)
    newChain.mineBlock(value)

    const nextValue = { to: "2", from: "1", amount: 50 };
    newChain.mineBlock(nextValue)
    blockchain.replaceChain(newChain.chain);
    
    expect(blockchain).toEqual(newChain)
    expect(blockchain.currentBlock().value).toEqual(nextValue)
  })

});
