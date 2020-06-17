import { Block, GenisisBlock } from "./block";
import { Transaction } from "../wallet/transactions";
import { Wallet } from "../wallet/wallet";


describe("Blocks", () => {
  let transactions = [Transaction.create(Wallet.blockChainWallet(), 'Address', 10)];
  // mock date now function
  Date.now = jest.fn(() => 12345);

  test("Creates a Genisis Block", () => {
    const genisis = new GenisisBlock();
    expect(genisis.hash).toEqual('Genisis');
    expect(genisis.lastHash).toBeNull();
  });

  test("Creates a Block", () => {
    const genisis = new GenisisBlock();
    const block = new Block(genisis, transactions);
    expect(block.lastHash).toEqual(genisis.hash);
    expect(block.value).toEqual(transactions);
  });

  test('Mine block to work to return true if preceeding zeros is greater than or equal to difficulty', () => {
    const difficulty = 4;
    const hash = '0000ljdasbflbdasfkj'

    expect(Block.isMined(hash, difficulty)).toEqual(true)
  })

  test('Mine block to work to return false if preceeding zeros is less than the difficulty', () => {
    const difficulty = 4;
    const hash = '000ljdasbflbdasfkj'

    expect(Block.isMined(hash, difficulty)).toEqual(false)
  })

});
