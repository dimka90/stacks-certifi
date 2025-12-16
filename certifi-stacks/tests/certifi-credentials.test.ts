import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account } from '@stacks/cli';

describe('Certifi Credentials Contract', () => {
  let chain: Chain;
  let accounts: Map<string, Account>;

  beforeEach(async () => {
    chain = await Clarinet.setup();
    accounts = chain.getAccounts();
  });

  describe('Credential Issuance', () => {
    it('should issue a new credential', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should prevent duplicate credential hash', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student1 = accounts.get('wallet_2')!;
      const student2 = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      // Issue first credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student1.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      // Try to issue duplicate
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student2.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-002'
          ],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Credential Verification', () => {
    it('should verify a credential', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      // Issue credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      // Verify credential
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'verify-credential',
          [0],
          verifier.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Credential Revocation', () => {
    it('should revoke a credential', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      // Issue credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      // Revoke credential
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Fraudulent credential'],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should prevent revoking already revoked credential', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      // Issue credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      // Revoke credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Fraudulent credential'],
          wallet1.address
        ),
      ]);

      // Try to revoke again
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Another reason'],
          wallet1.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });

  describe('Read-Only Functions', () => {
    it('should retrieve credential details', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-credentials',
        'get-credential',
        [0]
      );

      expect(result.result).toBeTruthy();
    });

    it('should verify credential by hash', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-credentials',
        'verify-credential-hash',
        [credentialHash]
      );

      expect(result.result).toBeTruthy();
    });

    it('should get total issued credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-credentials',
        'get-total-issued',
        []
      );

      expect(result.result).toMatch(/u1/);
    });
  });

  describe('Student Credentials', () => {
    it('should track student credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('a'.repeat(64), 'hex');

      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-001'
          ],
          wallet1.address
        ),
      ]);

      const result = chain.callReadOnlyFn(
        'certifi-credentials',
        'get-student-credential-count',
        [student.address]
      );

      expect(result.result).toMatch(/u1/);
    });
  });
});
