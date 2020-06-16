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
    transaction = new Transaction(wallet, recipient, amount);
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
    } else {
      throw new Error("Transaction Failed");
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
    } else {
      throw new Error("Transaction Failed");
    }
  });

  it("inputs the balance of the wallet", () => {
    if (!(transaction instanceof Error)) {
      expect(transaction.input.amount).toEqual(wallet.balance);
    } else {
      throw new Error("Transaction Failed");
    }
  });

  it("validates a valid transaction", () => {
    if (!(transaction instanceof Error)) {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
    } else {
      throw new Error("Transaction Failed");
    }
  });

  it("invalidates a corrupt transaction", () => {
    if (!(transaction instanceof Error)) {
      // Fake the transaction with a different amount
      let newtransaction = JSON.parse(JSON.stringify(transaction));
      newtransaction.outputs[0].amount = 100;

      expect(Transaction.verifyTransaction(newtransaction)).toBe(false);
    } else {
      throw new Error("Transaction Failed");
    }
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
      if (!(transaction instanceof Error)) {
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
      } else {
        throw new Error("Transaction Failed");
      }
    });

    test("will throw an error if amount is greater than balance", () => {
      const exccedBalance = () => {
        if (!(transaction instanceof Error)) {
          amount = 10000;
          transaction.update(wallet, nextRecipient, amount);
        }
      };

      expect(exccedBalance).toThrow(Error);
    });
  });
});
