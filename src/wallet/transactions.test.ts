import { Transaction } from "./transactions";
import { Wallet } from "./wallet";

describe("Transaction", () => {
  let transaction: Transaction | Error;
  let wallet: Wallet;
  let recipient: string;
  let amount: number;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "randomaddress";
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("outputs the amount subtracted from the wallet balance", () => {
    if (!(transaction instanceof Error)) {
      let output = transaction.outputs.find(
        (output) => output.address === wallet.publicKey
      );
      expect(output).toBeDefined();
      if (!output) {
        throw new Error("No output");
      } else {
        expect(output.amount).toEqual(wallet.balance - amount);
      }
    }
  });

  it("outputs the amount added to the recipient", () => {
    if (!(transaction instanceof Error)) {
      let output = transaction.outputs.find(
        (output) => output.address === recipient
      );
      expect(output).toBeDefined();
      if (!output) {
        throw new Error("No output");
      } else {
        expect(output.amount).toEqual(amount);
      }
    }
  });

  describe("tranacting with amount that exceeds the balance", () => {
    beforeEach(() => {
      amount = 10000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    test('does not create transaction', () => {
        expect(transaction instanceof Error).toBe(true)
    })
  });
});
