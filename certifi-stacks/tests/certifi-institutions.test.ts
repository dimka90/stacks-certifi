import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account } from '@stacks/cli';

describe('Certifi Institutions Contract', () => {
  let chain: Chain;
  let accounts: Map<string, Account>;

  beforeEach(async () => {
    chain = await Clarinet.setup();
    accounts = chain.getAccounts();
  });

  describe('Institution Registration', () => {
    it('should register a new institution', async () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'University of Lagos',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should prevent duplicate institution registration', async () => {
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'University of Lagos',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'Another University',
            'Nigeria',
            'REG-002',
            'https://metadata.example.com/another'
          ],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should reject invalid institution name', async () => {
      const wallet1 = accounts.get('wallet_1')!;

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            '',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Verifier Management', () => {
    it('should add a verifier', async () => {
      const deployer = accounts.get('deployer')!;
      const verifier = accounts.get('wallet_1')!;

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'add-verifier',
          [verifier.address],
          deployer.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should prevent non-owner from adding verifier', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const wallet2 = accounts.get('wallet_2')!;

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'add-verifier',
          [wallet2.address],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Institution Verification', () => {
    it('should verify an institution', async () => {
      const deployer = accounts.get('deployer')!;
      const wallet1 = accounts.get('wallet_1')!;

      // Register institution
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'University of Lagos',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      // Add verifier
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'add-verifier',
          [deployer.address],
          deployer.address
        ),
      ]);

      // Verify institution
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'verify-institution',
          [0],
          deployer.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Read-Only Functions', () => {
    it('should retrieve institution details', async () => {
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'University of Lagos',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-institutions',
        'get-institution',
        [0]
      );

      expect(result.result).toBeTruthy();
    });

    it('should get institution count', async () => {
      const wallet1 = accounts.get('wallet_1')!;

      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'University of Lagos',
            'Nigeria',
            'REG-001',
            'https://metadata.example.com/unilag'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-institutions',
        'get-institution-count',
        []
      );

      expect(result.result).toMatch(/u1/);
    });
  });
});
