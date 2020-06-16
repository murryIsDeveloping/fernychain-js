import { hash } from './../util';

const BLOCKTIME = 3000

export type BlockValue = {
    readonly to: string,
    readonly from: string,
    readonly amount: number,
}


export interface IBlock {
    timestamp: number
    hash: string
    lastHash: string | null
    value: BlockValue | null
    difficulty: number
    noonce: number
    toString: () => string
}

export class Block implements IBlock {
    public readonly timestamp: number
    public readonly hash: string
    public readonly lastHash: string
    public readonly difficulty: number
    public readonly noonce: number

    constructor(previousBlock: IBlock, public readonly value: BlockValue){
        this.lastHash = previousBlock.hash
        this.noonce = 0
        do {
            this.timestamp = Date.now();
            this.difficulty = Block.adjustDifficulty(previousBlock);
            this.noonce++;
            this.hash = Block.createHash(this.timestamp, this.value, this.lastHash, this.noonce, this.difficulty);
        } while (!Block.isMined(this.hash, this.difficulty))
    }

    static adjustDifficulty(prevBlock: IBlock): number {
        return prevBlock.timestamp + BLOCKTIME > Date.now() ? prevBlock.difficulty - 1 : prevBlock.difficulty + 1
    }

    static isMined(hash: string, difficulty: number): boolean {
        return hash.substr(0, difficulty) === '0'.repeat(difficulty)
    }

    public toString(){
        return `Block: ${this.hash}
            timestamp :  ${this.timestamp},
            lastHash  :  ${this.lastHash},
            to        : ${this.value.to},
            from      : ${this.value.from},
            amount    : ${this.value.amount}
        `;
    }

    static createHash(timestamp: number, value: BlockValue, lastHash: string, noonce: number, difficulty: number): string {
        return hash(`${timestamp}${JSON.stringify(value)}${lastHash}${noonce}${difficulty}`);
    }
}

export class GenisisBlock implements IBlock {
    public readonly timestamp: number;
    public readonly hash: string;
    public readonly lastHash: null;
    public readonly value: null;
    public readonly difficulty: number;
    public readonly noonce: number;

    constructor(){
        this.timestamp = 0;
        this.hash = 'Genisis';
        this.lastHash = null
        this.value = null
        this.difficulty = 2
        this.noonce = 0
    }

    public toString(){
        return `Block: ${this.hash}
            timestamp :  ${this.timestamp},
            lastHash  :  ${this.lastHash},
            to        : null,
            from      : null,
            amount    : null
        `;
    }
}