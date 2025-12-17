# Write Functions Guide - State-Changing Operations

Complete guide for using the write functions script to perform state-changing operations on Certifi.

## 📝 Overview

The `write-functions.js` script provides a complete workflow for:
1. Registering institutions
2. Managing verifiers
3. Issuing credentials
4. Verifying credentials
5. Revoking credentials

## 🚀 Quick Start

### Run Default Workflow
```bash
npm run write
```

This will execute a complete example workflow:
1. Register an institution
2. Issue a credential
3. Verify the credential

### Run Specific Functions

Edit `scripts/write-functions.js` and uncomment the operations you need.

## 📋 Available Functions

### Institution Functions

#### 1. Register Institution
```javascript
await registerInstitution(
  'University of Lagos',
  'Nigeria',
  'REG-UNILAG-2024',
  'https://metadata.example.com/unilag'
);
```

**Parameters:**
- `name` (string): Institution name
- `country` (string): Country name
- `regNumber` (string): Registration number
- `metadataUri` (string): URI to institution metadata

**Returns:** Transaction ID

**Gas Cost:** ~0.01-0.05 STX

#### 2. Add Verifier
```javascript
await addVerifier('SP2VERIFIER_ADDRESS');
```

**Parameters:**
- `verifierAddress` (string): Stacks address of verifier

**Returns:** Transaction ID

**Gas Cost:** ~0.01-0.05 STX

**Note:** Only contract owner can add verifiers

#### 3. Verify Institution
```javascript
await verifyInstitution(0);
```

**Parameters:**
- `institutionId` (uint): ID of institution to verify

**Returns:** Transaction ID

**Gas Cost:** ~0.01-0.05 STX

**Note:** Only verifiers can verify institutions

### Credential Functions

#### 4. Issue Credential
```javascript
const result = await issueCredential(
  'SP2STUDENT_ADDRESS',
  0,
  'Bachelor of Science in Computer Science',
  'Student: John Doe, Program: BSc CS, Year: 2024, Grade: A',
  'https://metadata.example.com/credential-001'
);

// Returns:
// {
//   txid: 'transaction-id',
//   hash: 'credential-hash'
// }
```

**Parameters:**
- `studentAddress` (string): Stacks address of student
- `institutionId` (uint): ID of issuing institution
- `credentialType` (string): Type of credential
- `credentialData` (string): Credential data (will be hashed)
- `metadataUri` (string): URI to credential metadata

**Returns:** Object with transaction ID and credential hash

**Gas Cost:** ~0.01-0.05 STX

**Note:** Credential data is automatically hashed using SHA-256

#### 5. Verify Credential
```javascript
await verifyCredential(0);
```

**Parameters:**
- `credentialId` (uint): ID of credential to verify

**Returns:** Transaction ID

**Gas Cost:** ~0.01-0.05 STX

#### 6. Revoke Credential
```javascript
await revokeCredential(0, 'Fraudulent credential');
```

**Parameters:**
- `credentialId` (uint): ID of credential to revoke
- `reason` (string): Reason for revocation

**Returns:** Transaction ID

**Gas Cost:** ~0.01-0.05 STX

## 🔄 Complete Workflow Example

### Step 1: Register Institution

```javascript
const institutionTxId = await registerInstitution(
  'University of Lagos',
  'Nigeria',
  'REG-UNILAG-2024',
  'https://metadata.example.com/unilag'
);
```

### Step 2: Add Verifier (Optional)

```javascript
const verifierTxId = await addVerifier('SP2VERIFIER_ADDRESS');
```

### Step 3: Verify Institution (Optional)

```javascript
const verifyInstTxId = await verifyInstitution(0);
```

### Step 4: Issue Credential

```javascript
const credentialResult = await issueCredential(
  'SP2STUDENT_ADDRESS',
  0,
  'Bachelor of Science in Computer Science',
  'Student: John Doe, Program: BSc CS, Year: 2024, Grade: A',
  'https://metadata.example.com/credential-001'
);

console.log('Credential Hash:', credentialResult.hash);
```

### Step 5: Verify Credential

```javascript
const verifyCredTxId = await verifyCredential(0);
```

### Step 6: Revoke Credential (If Needed)

```javascript
const revokeTxId = await revokeCredential(0, 'Fraudulent credential');
```

## 🎯 Usage Patterns

### Pattern 1: Simple Institution Registration

```bash
# Edit scripts/write-functions.js
# Comment out all steps except registerInstitution

npm run write
```

### Pattern 2: Complete Credential Lifecycle

```bash
# Run default workflow (already includes all steps)
npm run write
```

### Pattern 3: Custom Workflow

```javascript
// Edit scripts/write-functions.js

async function customWorkflow() {
  // Your custom operations
  const instTxId = await registerInstitution(...);
  const credTxId = await issueCredential(...);
  const verifyTxId = await verifyCredential(...);
}

customWorkflow();
```

## 📊 Gas Optimization

### Minimize Gas Costs

1. **Batch Operations**
   - Combine multiple operations in one script run
   - Reduces overhead

2. **Test on Testnet First**
   ```bash
   STACKS_NETWORK=testnet npm run write
   ```

3. **Monitor Gas Prices**
   - Check Stacks Explorer before mainnet operations
   - Deploy during low-gas periods

4. **Use Read-Only Calls First**
   ```bash
   npm run mainnet-interact
   ```
   Check data before making state changes

### Typical Costs

| Operation | Cost |
|-----------|------|
| Register Institution | 0.01-0.05 STX |
| Add Verifier | 0.01-0.05 STX |
| Verify Institution | 0.01-0.05 STX |
| Issue Credential | 0.01-0.05 STX |
| Verify Credential | 0.01-0.05 STX |
| Revoke Credential | 0.01-0.05 STX |
| **Total for all 6** | **0.06-0.30 STX** |

## 🔐 Security Considerations

### Before Mainnet

1. **Test on Testnet**
   ```bash
   STACKS_NETWORK=testnet npm run write
   ```

2. **Verify Addresses**
   - Double-check all Stacks addresses
   - Ensure correct institution/credential IDs

3. **Review Metadata**
   - Verify metadata URIs are correct
   - Ensure metadata is accessible

### On Mainnet

1. **Use Correct Network**
   ```bash
   STACKS_NETWORK=mainnet npm run write
   ```

2. **Monitor Transactions**
   - Get transaction ID from output
   - Visit Stacks Explorer
   - Wait for confirmation

3. **Keep Records**
   - Save transaction IDs
   - Document credential hashes
   - Maintain audit trail

## 🔍 Monitoring Transactions

### Get Transaction ID
```
✅ INSTITUTION REGISTERED!
Transaction ID: 0x1234567890abcdef...
```

### Monitor on Explorer
1. Visit: https://explorer.stacks.co/
2. Search transaction ID
3. Wait for confirmation (10-30 minutes)

### Check Credential Hash
```
Credential Hash: a1b2c3d4e5f6...
```

Save this for verification later.

## 🛠️ Customization

### Add Custom Function

```javascript
async function customOperation() {
  try {
    console.log(`\n📝 CUSTOM OPERATION`);
    console.log(`${'─'.repeat(70)}`);

    const txOptions = {
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'your-function',
      functionArgs: [
        // Your arguments
      ],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ OPERATION COMPLETE!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error:`, error.message);
    throw error;
  }
}
```

### Export Custom Function

```javascript
module.exports = {
  registerInstitution,
  addVerifier,
  verifyInstitution,
  issueCredential,
  verifyCredential,
  revokeCredential,
  customOperation, // Add your function
};
```

## 📞 Troubleshooting

### "Insufficient balance"
- Check your STX balance
- Add more STX to your account

### "Unauthorized"
- Verify you have correct permissions
- Check if you're the contract owner/verifier

### "Transaction stuck"
- Wait 30+ minutes
- Check network status
- Try again with higher gas

### "Contract not found"
- Verify contract addresses in `deployments/deployment.json`
- Ensure you're on correct network

## 🎓 Examples

### Example 1: Register Multiple Institutions

```javascript
async function registerMultiple() {
  const institutions = [
    {
      name: 'University of Lagos',
      country: 'Nigeria',
      regNumber: 'REG-UNILAG-2024',
      uri: 'https://metadata.example.com/unilag'
    },
    {
      name: 'University of Ibadan',
      country: 'Nigeria',
      regNumber: 'REG-UI-2024',
      uri: 'https://metadata.example.com/ui'
    }
  ];

  for (const inst of institutions) {
    await registerInstitution(
      inst.name,
      inst.country,
      inst.regNumber,
      inst.uri
    );
  }
}
```

### Example 2: Issue Multiple Credentials

```javascript
async function issueMultiple() {
  const credentials = [
    {
      student: 'SP2STUDENT1',
      type: 'Bachelor of Science',
      data: 'Student 1 data'
    },
    {
      student: 'SP2STUDENT2',
      type: 'Master of Science',
      data: 'Student 2 data'
    }
  ];

  for (const cred of credentials) {
    await issueCredential(
      cred.student,
      0,
      cred.type,
      cred.data,
      'https://metadata.example.com/credential'
    );
  }
}
```

## ✨ Features

✅ Automatic contract address loading
✅ SHA-256 credential hashing
✅ Transaction monitoring
✅ Error handling
✅ Network detection
✅ Detailed logging
✅ Exportable functions
✅ Easy customization

## 📚 Related Documentation

- [MAINNET_INTERACTION.md](MAINNET_INTERACTION.md) - Read-only operations
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

## 🎯 Next Steps

1. **Test on Testnet**
   ```bash
   STACKS_NETWORK=testnet npm run write
   ```

2. **Review Transactions**
   - Check Stacks Explorer
   - Verify operations succeeded

3. **Deploy to Mainnet**
   ```bash
   STACKS_NETWORK=mainnet npm run write
   ```

4. **Monitor and Maintain**
   - Keep transaction records
   - Monitor contract health

## 📄 Summary

The write functions script provides a complete, gas-optimized way to perform state-changing operations on Certifi. Use it to:

- Register institutions
- Manage verifiers
- Issue credentials
- Verify credentials
- Revoke credentials

Always test on testnet first, monitor gas prices, and keep detailed records of all transactions!
