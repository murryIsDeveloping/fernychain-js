import { Transaction } from "./transactions";
import { Wallet } from "./wallet";

describe("Transaction", () => {
  let transaction: Transaction;
  let wallet: Wallet;
  let recipient: string;
  let amount: number;

  beforeEach(() => {
    wallet = Wallet.userWallet();
    amount = 50;
    recipient = "randomaddress";
    transaction = new Transaction(wallet, recipient, amount);
  });

  it("outputs the amount subtracted from the wallet balance", () => {
      let output = transaction.outputs.find(
        (output) => output.address === wallet.publicKey
      );
      expect(output).toBeDefined();
      if (!output) {
        throw new Error("No output");
      } else {
        expect(output.amount).toEqual(wallet.balance - amount);
      }
  });

  it("outputs the amount added to the recipient", () => {
      let output = transaction.outputs.find(
        (output) => output.address === recipient
      );
      expect(output).toBeDefined();
      if (!output) {
        throw new Error("No output");
      } else {
        expect(output.amount).toEqual(amount);
      }
  });

  it("inputs the balance of the wallet", () => {
      expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("validates a valid transaction", () => {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });

  it("invalidates a corrupt transaction", () => {
      // Fake the transaction with a different amount
      let newtransaction = JSON.parse(JSON.stringify(transaction));
      newtransaction.outputs[0].amount = 100;

      expect(Transaction.verifyTransaction(newtransaction)).toBe(false);
  });

  describe("tranacting with amount that exceeds the balance", () => {
    test("does not create transaction", () => {
      const exccedBalance = () => {
        amount = 10000;
        transaction = new Transaction(wallet, recipient, amount);
      };
      expect(exccedBalance).toThrow(Error);
    });
  });

  describe("updating a transaction", () => {
    let nextAmount: number;
    let nextRecipient: string;

    beforeEach(() => {
      nextAmount = 30;
      nextRecipient = "AnotherWallet";
    });

    test("will update the transaction", () => {
        transaction.update(wallet, nextRecipient, nextAmount);
        expect(transaction.input.amount).toEqual(wallet.balance);
        expect(transaction.outputs.length).toEqual(3);
        let output = transaction.outputs.find(
          (output) => output.address === nextRecipient
        );
        expect(output).toBeDefined();
        if (!output) {
          throw new Error("No output");
        } else {
          expect(output.amount).toEqual(nextAmount);
        }
    });

    test("will throw an error if amount is greater than balance", () => {
      const exccedBalance = () => {
        amount = 10000;
        transaction.update(wallet, nextRecipient, amount);
      };

      expect(exccedBalance).toThrow(Error);
    });
  });
});
