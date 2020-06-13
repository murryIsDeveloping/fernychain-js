import { Block, BlockValue, GenisisBlock, IBlock } from "./block";

describe("Blocks", () => {
    
  test("Creates a Genisis Block", () => {
    const genisis = new GenisisBlock();
    expect(genisis.value).toBeNull();
    expect(genisis.lastHash).toBeNull();
  });

  test("Creates a Block", () => {
    const value = {
        to: '1',
        from: '2',
        amount: 100
    };
    const genisis = new GenisisBlock();
    const block = new Block(genisis.hash, value);
    expect(block.lastHash).toEqual(genisis.hash);
    expect(block.value).toEqual(value)
  });
});
