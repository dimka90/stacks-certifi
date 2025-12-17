# Mainnet Interaction Guide - Gas-Optimized

This guide explains how to use the mainnet interaction script while minimizing gas consumption.

## 🎯 Key Principle

**Use read-only calls whenever possible** - they're FREE and don't consume gas!

## 📊 Gas Costs Comparison

| Operation | Gas Cost | Type |
|-----------|----------|------|
| Get institution count | FREE | Read-only |
| Get verified count | FREE | Read-only |
| Get institution details | FREE | Read-only |
| Get total issued | FREE | Read-only |
| Get total revoked | FREE | Read-only |
| Get total active | FREE | Read-only |
| Get credential details | FREE | Read-only |
| Verify credential by hash | FREE | Read-only |
| Register institution | ~0.01-0.05 STX | State-changing |
| Issue credential | ~0.01-0.05 STX | State-changing |
| Verify credential | ~0.01-0.05 STX | State-changing |
| Revoke credential | ~0.01-0.05 STX | State-changing |

## 🚀 Usage

### Run Read-Only Queries (FREE)

```bash
npm run mainnet-interact
```

This will:
- Get institution count
- Get verified institutions count
- Get total credentials issued
- Get total credentials revoked
- Get total active credentials
- Get first institution details
- **Cost: 0 STX** ✅

### Run State-Changing Operations (COSTS GAS)

Edit `scripts/mainnet-interact.js` and uncomment the operations you want:

```javascript
// Uncomment the operations you need:

// Register institution
await registerInstitution(
  'University of Example',
  'Country',
  'REG-001',
  'https://metadata.example.com/uni'
);

// Issue credential
await issueCredential(
  'SP2STUDENT_ADDRESS',
  0,
  'Bachelor of Science',
  'a'.repeat(64),
  'https://metadata.example.com/credential'
);

// Verify credential
await verifyCredential(0);

// Revoke credential
await revokeCredential(0, 'Fraudulent credential');
```

Then run:
```bash
npm run mainnet-interact
```

## 💡 Gas Optimization Tips

### 1. Batch Operations
Instead of multiple transactions, combine operations when possible.

### 2. Use Read-Only Calls First
Always check data with read-only calls before making state changes:

```javascript
// FREE - Check if credential exists
const credential = await getCredential(0);

// Only if needed - Issue credential (COSTS GAS)
if (!credential) {
  await issueCredential(...);
}
```

### 3. Monitor Gas Prices
Check current gas prices before deploying:
- Visit: https://explorer.stacks.co/
- Look at recent transactions
- Adjust timing if prices are high

### 4. Use Testnet First
Always test on testnet before mainnet:

```bash
# Edit .env
STACKS_NETWORK=testnet

# Run script
npm run mainnet-interact
```

## 📋 Script Functions

### Read-Only Functions (FREE)

```javascript
// Get total institutions
await getInstitutionCount();

// Get verified institutions
await getVerifiedCount();

// Get institution by ID
await getInstitution(0);

// Get total credentials issued
await getTotalIssued();

// Get total credentials revoked
await getTotalRevoked();

// Get total active credentials
await getTotalActive();

// Get credential by ID
await getCredential(0);

// Verify credential by hash
await verifyCredentialHash('a'.repeat(64));
```

### State-Changing Functions (COSTS GAS)

```javascript
// Register institution
await registerInstitution(
  'University Name',
  'Country',
  'REG-NUMBER',
  'https://metadata-uri'
);

// Issue credential
await issueCredential(
  'SP2STUDENT_ADDRESS',
  institutionId,
  'Credential Type',
  'credential-hash',
  'https://metadata-uri'
);

// Verify credential
await verifyCredential(credentialId);

// Revoke credential
await revokeCredential(credentialId, 'Reason');
```

## 🔍 Monitoring Transactions

After running state-changing operations:

1. **Get transaction ID** from script output
2. **Visit Stacks Explorer**: https://explorer.stacks.co/
3. **Search transaction ID**
4. **Monitor confirmation** (usually 10-30 minutes)

## ⚠️ Important Notes

### Before Mainnet

1. **Test on testnet first**
   ```bash
   STACKS_NETWORK=testnet npm run mainnet-interact
   ```

2. **Verify contract addresses**
   ```bash
   cat deployments/deployment.json
   ```

3. **Check gas prices**
   - Visit Stacks Explorer
   - Look at recent transaction costs

### On Mainnet

1. **Start with read-only calls** (FREE)
2. **Only do state-changing operations when necessary**
3. **Monitor transaction confirmations**
4. **Keep transaction IDs for records**

## 💰 Cost Estimation

### Typical Mainnet Costs

| Operation | Estimated Cost |
|-----------|----------------|
| Register institution | 0.01-0.05 STX |
| Issue credential | 0.01-0.05 STX |
| Verify credential | 0.01-0.05 STX |
| Revoke credential | 0.01-0.05 STX |
| **Total for all 4** | **0.04-0.20 STX** |

### How to Minimize

1. **Use read-only calls** (FREE)
2. **Batch operations** when possible
3. **Deploy during low-gas periods**
4. **Test on testnet first**

## 🎯 Recommended Workflow

### Step 1: Monitor (FREE)
```bash
npm run mainnet-interact
```
Check current state without spending gas.

### Step 2: Plan
Review the data and decide what changes are needed.

### Step 3: Execute (COSTS GAS)
Edit script to uncomment needed operations.
```bash
npm run mainnet-interact
```

### Step 4: Verify
Check transaction on Stacks Explorer.

## 📞 Troubleshooting

### "Insufficient balance"
- Check your STX balance
- Add more STX to your account

### "Transaction stuck"
- Wait 30+ minutes
- Check network status
- Try again with higher gas

### "Contract not found"
- Verify contract addresses in `deployments/deployment.json`
- Ensure you're on correct network

## 🔗 Resources

- [Stacks Explorer](https://explorer.stacks.co/)
- [Stacks Docs](https://docs.stacks.co/)
- [Gas Estimation](https://docs.stacks.co/understand-stacks/transaction-costs)

## ✨ Summary

- ✅ Use read-only calls for monitoring (FREE)
- ✅ Only use state-changing operations when necessary
- ✅ Test on testnet first
- ✅ Monitor gas prices
- ✅ Keep transaction records

This approach minimizes gas costs while keeping your contracts fully functional on mainnet!
