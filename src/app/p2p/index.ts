import WebSocket from "ws";
import { BlockChain } from "./../../blockchain";
import { TransactionPool } from "./../../wallet/transaction-pool";
import { Transaction } from "./../../wallet/transactions";

enum MessageType {
  BLOCK = "BLOCK",
  TRANSACTION = "TRANSACTION",
}

type P2pMessage = {
  type: MessageType;
  value: string;
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
      socket.send({
        type: MessageType.BLOCK,
        value: JSON.stringify(this.blockchain.chain),
      });
    });
  }

  public syncTransactions(transaction: Transaction) {
    this.sockets.forEach((socket) => {
      socket.send({
        type: MessageType.TRANSACTION,
        value: JSON.stringify(transaction),
      });
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
    socket.on("message", (message: P2pMessage) => {
      if (message && message.value) {
        const data = JSON.parse(message.value);
        switch (message.type) {
          case MessageType.BLOCK:
            this.blockchain.replaceChain(data);
            break;
          case MessageType.TRANSACTION:
            this.pool.updateOrAddTransaction(data);
            break;
        }
      }
    });
  }
}
