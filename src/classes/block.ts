import * as crypto from 'crypto';

export type BlockValue = {
    to: string,
    from: string,
    amount: number,
}


export interface IBlock {
    timestamp: number
    hash: string
    lastHash: string | null
    value: BlockValue | null
    toString: () => void
}

export class Block implements IBlock {
    public readonly timestamp: number;
    public readonly hash: string;

    constructor(public readonly lastHash: string, public readonly value: BlockValue){
        this.timestamp = Date.now()
        this.hash = this.createHash()
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

    private createHash(): string {
        return crypto.createHmac('sha256', this.timestamp.toString())
            .update(this.value.toString())
            .digest('hex');
    }
}

export class GenisisBlock implements IBlock {
    public readonly timestamp: number;
    public readonly hash: string;
    public readonly lastHash: null;
    public readonly value: null;

    constructor(){
        this.timestamp = Date.now();
        this.hash = '177364DB1616B5D5E9A14253F5B16F2E9BF113586EEF7AE262B30702C0763E2A';
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

