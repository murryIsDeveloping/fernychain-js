import { Block, BlockValue, GenisisBlock, IBlock } from "./block";

export class BlockChain {
  private blocks: IBlock[] = [];

  constructor() {
    this.blocks.push(new GenisisBlock());
  }

  public currentBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  public addBlock(value: BlockValue) {
    const nextBlock = new Block(this.currentBlock().hash, value);
    this.blocks.push(nextBlock);
  }

  public printBlocks(){
    this.blocks.forEach(x => console.log(x.toString()))
  }
}
