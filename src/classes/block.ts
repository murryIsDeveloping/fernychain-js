import * as crypto from 'crypto';

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
    toString: () => string
}

export class Block implements IBlock {
    public readonly timestamp: number;
    public readonly hash: string;

    constructor(public readonly lastHash: string, public readonly value: BlockValue){
        this.timestamp = Date.now()
        this.hash = createHash(this)
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
}

export class GenisisBlock implements IBlock {
    public readonly timestamp: number;
    public readonly hash: string;
    public readonly lastHash: null;
    public readonly value: null;

    constructor(){
        this.timestamp = Date.now();
        this.hash = createHash(this);
        this.lastHash = null
        this.value = null
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

export function createHash(block: IBlock): string {
    return crypto.createHmac('sha256', block.timestamp.toString())
        .update(block.value ? JSON.stringify(block.value): 'Genisis')
        .digest('hex');
}