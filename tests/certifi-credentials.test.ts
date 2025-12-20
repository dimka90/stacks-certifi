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

  describe('Institution Verification Requirement', () => {
    it('should prevent unverified institutions from issuing credentials', async () => {
      const deployer = accounts.get('deployer')!;
      const institutionOwner = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('b'.repeat(64), 'hex');

      // Register institution (but don't verify it)
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'Unverified University',
            'Nigeria',
            'REG-UNVERIFIED',
            'https://metadata.example.com/unverified'
          ],
          institutionOwner.address
        ),
      ]);

      // Try to issue credential with unverified institution (ID 0)
      // NOTE: This test will currently FAIL because the contract doesn't check verification yet
      // Once the contract is fixed to check institution verification, this test should pass
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0, // Unverified institution ID
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-unverified'
          ],
          institutionOwner.address
        ),
      ]);

      // Expected: Should fail because institution is not verified
      // TODO: Currently fails because contract doesn't implement this check
      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should allow verified institutions to issue credentials', async () => {
      const deployer = accounts.get('deployer')!;
      const institutionOwner = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('c'.repeat(64), 'hex');

      // Register institution
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'register-institution',
          [
            'Verified University',
            'Nigeria',
            'REG-VERIFIED',
            'https://metadata.example.com/verified'
          ],
          institutionOwner.address
        ),
      ]);

      // Add deployer as verifier
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'add-verifier',
          [deployer.address],
          deployer.address
        ),
      ]);

      // Verify institution
      chain.mineBlock([
        Tx.contractCall(
          'certifi-institutions',
          'verify-institution',
          [0],
          deployer.address
        ),
      ]);

      // Issue credential with verified institution
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0, // Verified institution ID
            'Bachelor of Science',
            credentialHash,
            'none',
            'https://metadata.example.com/credential-verified'
          ],
          institutionOwner.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Expiry Date Handling', () => {
    it('should prevent verification of expired credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('d'.repeat(64), 'hex');

      // Issue credential with expiry date set to 1 (very low, definitely expired)
      // The credential will be issued at current block height, but expiry is set to 1
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            1, // Expired expiry date (block 1, but we're much further ahead)
            'https://metadata.example.com/credential-expired'
          ],
          wallet1.address
        ),
      ]);

      // Try to verify expired credential
      // NOTE: This test will currently FAIL because the contract doesn't check expiry yet
      // Once the contract is fixed to check expiry dates, this test should pass
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'verify-credential',
          [0],
          verifier.address
        ),
      ]);

      // Expected: Should fail because credential is expired
      // TODO: Currently fails because contract doesn't implement expiry check
      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should allow verification of credentials with future expiry dates', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('e'.repeat(64), 'hex');

      // Issue credential with expiry date far in the future (999999 blocks)
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            999999, // Future expiry date
            'https://metadata.example.com/credential-future'
          ],
          wallet1.address
        ),
      ]);

      // Verify credential with future expiry
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

    it('should handle credentials without expiry dates', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('f'.repeat(64), 'hex');

      // Issue credential without expiry date
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            'none', // No expiry date
            'https://metadata.example.com/credential-no-expiry'
          ],
          wallet1.address
        ),
      ]);

      // Verify credential without expiry
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

  describe('Authorization Tests', () => {
    it('should prevent unauthorized users from revoking credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const wallet2 = accounts.get('wallet_2')!; // Unauthorized user
      const student = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('g'.repeat(64), 'hex');

      // Issue credential by wallet1
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
            'https://metadata.example.com/credential-auth'
          ],
          wallet1.address
        ),
      ]);

      // Try to revoke by unauthorized user (wallet2)
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Unauthorized revocation attempt'],
          wallet2.address // Not the issuer or contract owner
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should allow issuer to revoke their own credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('h'.repeat(64), 'hex');

      // Issue credential by wallet1
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
            'https://metadata.example.com/credential-issuer'
          ],
          wallet1.address
        ),
      ]);

      // Revoke by issuer (wallet1)
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Issuer revocation'],
          wallet1.address // Issuer
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });

    it('should allow contract owner to revoke any credential', async () => {
      const deployer = accounts.get('deployer')!; // Contract owner
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;

      const credentialHash = Buffer.from('i'.repeat(64), 'hex');

      // Issue credential by wallet1
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
            'https://metadata.example.com/credential-owner'
          ],
          wallet1.address
        ),
      ]);

      // Revoke by contract owner (deployer)
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Contract owner revocation'],
          deployer.address // Contract owner
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/ok/);
    });
  });

  describe('Verification Edge Cases', () => {
    it('should prevent verification of revoked credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('j'.repeat(64), 'hex');

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
            'https://metadata.example.com/credential-revoked'
          ],
          wallet1.address
        ),
      ]);

      // Revoke credential
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'revoke-credential',
          [0, 'Revoked for testing'],
          wallet1.address
        ),
      ]);

      // Try to verify revoked credential
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'verify-credential',
          [0],
          verifier.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should prevent verification of expired credentials', async () => {
      const wallet1 = accounts.get('wallet_1')!;
      const student = accounts.get('wallet_2')!;
      const verifier = accounts.get('wallet_3')!;

      const credentialHash = Buffer.from('k'.repeat(64), 'hex');

      // Issue credential with expiry date set to 1 (very low, definitely expired)
      chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'issue-credential',
          [
            student.address,
            0,
            'Bachelor of Science',
            credentialHash,
            1, // Expired expiry date
            'https://metadata.example.com/credential-expired-verify'
          ],
          wallet1.address
        ),
      ]);

      // Try to verify expired credential
      // NOTE: This test will currently FAIL because the contract doesn't check expiry yet
      // Once the contract is fixed to check expiry dates, this test should pass
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'verify-credential',
          [0],
          verifier.address
        ),
      ]);

      // Expected: Should fail because credential is expired
      // TODO: Currently fails because contract doesn't implement expiry check
      expect(block.receipts[0].result).toMatch(/err/);
    });

    it('should fail verification of non-existent credential', async () => {
      const verifier = accounts.get('wallet_3')!;

      // Try to verify non-existent credential (ID 999)
      const block = chain.mineBlock([
        Tx.contractCall(
          'certifi-credentials',
          'verify-credential',
          [999], // Non-existent credential ID
          verifier.address
        ),
      ]);

      expect(block.receipts[0].result).toMatch(/err/);
    });
  });
});
