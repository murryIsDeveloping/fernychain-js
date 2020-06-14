import { Block, BlockValue, GenisisBlock, IBlock, createHash } from "./block";

export class BlockChain {
  private blocks: IBlock[] = [];

  constructor() {
    this.blocks.push(new GenisisBlock());
  }

  public currentBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  public mineBlock(value: BlockValue) {
    const nextBlock = new Block(this.currentBlock().hash, value);
    this.blocks.push(nextBlock);
  }

  public printBlocks(){
    this.blocks.forEach(x => console.log(x.toString()))
  }

  public replaceChain(newChain: BlockChain): void {
    if(newChain.blocks.length > this.blocks.length){
      if(BlockChain.validateChain(newChain)){
        this.blocks = newChain.blocks
      }
    }
  }

  public static validateChain(blockChain: BlockChain): boolean {
    let genisis = new GenisisBlock();

    if(JSON.stringify(genisis) !== JSON.stringify(blockChain.blocks[0])){
      return false
    }

    for(let i = 1; i < blockChain.blocks.length; i++) {
      let currentBlockHash = createHash(blockChain.blocks[i])
      let prevBlockHash = createHash(blockChain.blocks[i-1])

      if (currentBlockHash !== blockChain.blocks[i].hash){
        return false
      }

      if(blockChain.blocks[i].lastHash !== prevBlockHash){
        return false
      }
    }

    return true
  }
}
