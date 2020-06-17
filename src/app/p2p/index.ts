import WebSocket from "ws";
import { BlockChain } from "./../../blockchain";
import { TransactionPool } from "./../../wallet/transaction-pool";
import { Transaction } from "./../../wallet/transactions";

enum MessageType {
  BLOCK = "BLOCK",
  TRANSACTION = "TRANSACTION",
  CLEAR_POOL = "CLEAR_POOL",
}

type P2pMessage = {
  type: MessageType;
  value: any;
};

const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

export class P2pServer {
  private sockets: WebSocket[] = [];

  constructor(public blockchain: BlockChain, public pool: TransactionPool) {}

  public listen(port: number) {
    const server = new WebSocket.Server({ port: port });
    server.on("connection", (socket) => {
      this.connectSocket(socket);
    });

    this.connectToPeers();

    console.log(`Socket listening on port : ${port}`);
  }

  public syncChain() {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify({
        type: MessageType.BLOCK,
        value: this.blockchain.chain,
      }));
    });
  }

  public syncTransactions(transaction: Transaction) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify({
        type: MessageType.TRANSACTION,
        value: transaction,
      }));
    });
  }

  public syncClearPool() {
    this.pool.clearPool()
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify({
        type: MessageType.CLEAR_POOL,
        value: "",
      }));
    });
  }

  private connectSocket(socket: WebSocket) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  private connectToPeers() {
    peers.forEach((peer) => {
      let socket = new WebSocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  public messageHandler(socket: WebSocket) {
    socket.on("message", (rawMessage: string) => {
      const message = <P2pMessage>JSON.parse(rawMessage);
      if (message && message.value) {
        const data = message.value;
        switch (message.type) {
          case MessageType.BLOCK:
            this.blockchain.replaceChain(message.value);
            break;
          case MessageType.TRANSACTION:
            this.pool.updateOrAddTransaction(message.value);
            break;
          case MessageType.CLEAR_POOL:
            this.pool.clearPool();
            break;
        }
      }
    });
  }
}
