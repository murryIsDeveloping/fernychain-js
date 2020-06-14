import { Block, BlockValue, GenisisBlock, IBlock } from "./block";

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
    const block = new Block(genisis.hash, value);
    expect(block.lastHash).toEqual(genisis.hash);
    expect(block.value).toEqual(value);
  });

  test("Hashes the same hash if block is the same", () => {
    const value = {
      to: "1",
      from: "2",
      amount: 100,
    };
    const genisis = new GenisisBlock();
    const block1 = new Block(genisis.hash, value);
    const block2 = new Block(genisis.hash, value);
    expect(block1.hash).toEqual(block2.hash);
  });

  test("Hashes a different hash if block are different", () => {
    const genisis = new GenisisBlock();
    const block1 = new Block(genisis.hash, {
      to: "1",
      from: "2",
      amount: 100,
    });

    const block2 = new Block(genisis.hash, {
      to: "1",
      from: "2",
      amount: 101,
    });

    expect(block1.hash).not.toEqual(block2.hash);
  });
});
