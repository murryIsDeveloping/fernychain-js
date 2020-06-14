import { Block, BlockValue, GenisisBlock, IBlock, createHash } from "./block";

export class BlockChain {
  private blocks: IBlock[] = [];

  constructor() {
    this.blocks.push(new GenisisBlock());
  }

  public get chain(): IBlock[] {
    return this.blocks
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

  public replaceChain(newChain: IBlock[]): void {
    if(newChain.length > this.blocks.length){
      if(BlockChain.validateChain(newChain)){
        this.blocks = newChain
      }
    }
  }

  public static validateChain(blocks: IBlock[]): boolean {
    let genisis = new GenisisBlock();

    if(genisis.hash !== blocks[0].hash || genisis.value !== genisis.value){
      return false
    }

    for(let i = 1; i < blocks.length; i++) {
      let currentBlockHash = createHash(blocks[i])
      let prevBlockHash = createHash(blocks[i-1])

      if (currentBlockHash !== blocks[i].hash){
        return false
      }

      if(blocks[i].lastHash !== prevBlockHash){
        return false
      }
    }

    return true
  }
}
