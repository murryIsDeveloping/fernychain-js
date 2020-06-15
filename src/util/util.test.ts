import { hash } from "./index";

describe('Util', () => {
    test("Hashes the same hash if block is the same", () => {
        const hash1 = hash(0, 'hash');
        const hash2 = hash(0, 'hash');
    
        expect(hash1).toEqual(hash2);
      });
    
      test("Hashes a different hash if block are different", () => {
        const hash1 = hash(0, 'hash');
        const hash2 = hash(0, 'hash1');
    
        expect(hash1).not.toEqual(hash2);
      });
})