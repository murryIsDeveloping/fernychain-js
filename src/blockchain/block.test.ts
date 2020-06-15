import { Block, GenisisBlock } from "./block";

describe("Blocks", () => {
  // mock date now function
  Date.now = jest.fn(() => 12345);

  test("Creates a Genisis Block", () => {
    const genisis = new GenisisBlock();
    expect(genisis.value).toBeNull();
    expect(genisis.lastHash).toBeNull();
  });

  test("Creates a Block", () => {
    const value = {
      to: "1",
      from: "2",
      amount: 100,
    };
    const genisis = new GenisisBlock();
    const block = new Block(genisis, value);
    expect(block.lastHash).toEqual(genisis.hash);
    expect(block.value).toEqual(value);
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
