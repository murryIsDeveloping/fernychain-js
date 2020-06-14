import WebSocket from 'ws';
import { BlockChain } from './../../blockchain';

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

export class P2pServer {
    private sockets: WebSocket[] = []

    constructor(public blockchain: BlockChain) {}

    public listen(port: number){
        const server = new WebSocket.Server({ port: port });
        server.on('connection', (socket) => { 
            this.connectSocket(socket)
        });

        this.connectToPeers()

        console.log(`Socket listening on port : ${port}`)
    }

    public syncChain(){
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify(this.blockchain.chain))
        })
    }

    private connectSocket(socket: WebSocket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        socket.send(JSON.stringify(this.blockchain.chain))
    }

    private connectToPeers(){
        peers.forEach(peer => {
            let socket = new WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket))

        })
    }

    public messageHandler(socket: WebSocket) {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
            console.log('chain', this.blockchain.chain)
        })
    }
}
