import { Block, GenisisBlock, IBlock } from "./block";
import { Transaction } from "./../wallet/transactions";

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

  public mineBlock(value: Transaction[]): Block {
    const nextBlock = new Block(this.currentBlock(), value);
    this.blocks.push(nextBlock);
    return nextBlock;
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
      let block = <Block>blocks[i];
      let currentBlockHash = Block.createHash(block.timestamp, block.value, block.lastHash, block.noonce, block.difficulty);

      if (currentBlockHash !== block.hash){
        return false
      }

      if(block.lastHash !== blocks[i-1].hash){
        return false
      }
    }

    return true
  }
}
