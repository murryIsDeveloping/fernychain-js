import { BlockChain } from "./blockchain";
import { GenisisBlock, Block } from "./block";
import { Transaction } from "../wallet/transactions";
import { Wallet } from "../wallet/wallet";

describe("Blockchain", () => {
  // mock date now function
  Date.now = jest.fn(() => 12345);

  let blockchain: BlockChain;
  let transactions: Transaction[]

  beforeEach(() => {
    blockchain = new BlockChain();
    transactions = [new Transaction(Wallet.userWallet(), 'Address', 10)];
  })

  test("Creates a Blockchain with a Genisis block", () => {
    expect(blockchain.currentBlock()).toEqual(new GenisisBlock());
  });

  test("Add to blockchain", () => {;
    const genisis = new GenisisBlock();
    const block = new Block(genisis, transactions);
    blockchain.mineBlock(transactions);
    expect(blockchain.currentBlock()).toEqual(block);
  });

  test("Validate valid blockchain", () => {
    blockchain.mineBlock(transactions)
    let invalid =  BlockChain.validateChain(blockchain.chain);
    expect(invalid).toBe(true)
  })

  test("Validate invalid blockchain", () => {
    blockchain.mineBlock(transactions)
    let invalidTransaction = JSON.parse(JSON.stringify(transactions));
    invalidTransaction[0].outputs[0].amount = 20000
    blockchain.currentBlock().value = invalidTransaction
    let invalid =  BlockChain.validateChain(blockchain.chain);
    expect(invalid).toBe(false)
  })


  test("Keep current chain if longer than new chain", () => {
    const newChain = new BlockChain()
    const value = { to: "1", from: "2", amount: 100 };
    blockchain.mineBlock(transactions)
    blockchain.replaceChain(newChain.chain);
    
    expect(blockchain).not.toEqual(newChain)
  })

  test("Update chain if new chain is longer", () => {
    const newChain = new BlockChain()
    const value = { to: "1", from: "2", amount: 100 };
    blockchain.mineBlock(transactions)
    newChain.mineBlock(transactions)
    newChain.mineBlock(transactions)
    blockchain.replaceChain(newChain.chain);
    
    expect(blockchain).toEqual(newChain)
  })

});
