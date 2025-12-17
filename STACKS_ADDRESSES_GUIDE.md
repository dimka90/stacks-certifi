# Stacks Addresses Guide

Complete guide for using valid Stacks addresses in Certifi scripts.

## 🔑 Understanding Stacks Addresses

### Address Format

**Testnet Addresses:**
- Start with `SP`
- Example: `SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY`
- Used for testing (free STX from faucet)

**Mainnet Addresses:**
- Start with `SM`
- Example: `SM2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY`
- Used for production (real STX required)

## 📋 Getting Your Stacks Address

### Step 1: Create Wallet
1. Visit: https://www.hiro.so/wallet
2. Create new wallet
3. Save seed phrase securely

### Step 2: Get Your Address
1. Open wallet
2. Your address is displayed in the wallet interface
3. Copy it (starts with SP for testnet)

### Step 3: Fund Your Account

**Testnet (FREE):**
```bash
# Visit: https://testnet.stacks.co/faucet
# Enter your address
# Receive 500 STX
```

**Mainnet (PAID):**
```bash
# Buy STX from exchange
# Transfer to your address
```

## 🧪 Test Addresses

### View Available Test Addresses
```bash
npm run addresses
```

### Example Test Addresses (Testnet)

**Students:**
- `SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY`
- `SP3PBR02Z2GMTG8ZK685D87AMCNSTW434P4AQJVQ`
- `SPNWZ5B2STRONRQR4BTWD8F3FEBZYHQD7JBS4ZP`

**Verifiers:**
- `SP2VCQQ7SNJWJG69H7F0SSU7HSTX7ZC32VTJZGVP`
- `SP1YJXE50CYNEJ4P4W5QP44GAJ16G2NRKKS2QH58`

## 🔧 Using Addresses in Scripts

### In write-functions.js

```javascript
// Use a valid Stacks address
const studentAddress = 'SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY';

const credentialResult = await issueCredential(
  studentAddress,
  0,
  'Bachelor of Science',
  'Student data...',
  'https://metadata.example.com/credential'
);
```

### In mainnet-interact.js

```javascript
// Add a verifier
await addVerifier('SP2VCQQ7SNJWJG69H7F0SSU7HSTX7ZC32VTJZGVP');
```

### In .env File

```env
STACKS_NETWORK=testnet
DEPLOYER_KEY=your_private_key
DEPLOYER_ADDRESS=SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY
```

## ✅ Validation

### Address Format Validation

The scripts validate addresses:

```javascript
// Valid addresses
if (!studentAddress.startsWith('SP') && !studentAddress.startsWith('SM')) {
  throw new Error('Invalid Stacks address');
}
```

### Common Errors

**Error: "Not a c32-encoded string"**
- Cause: Invalid address format
- Solution: Use valid Stacks address (starts with SP or SM)

**Error: "Invalid Stacks address"**
- Cause: Address doesn't start with SP or SM
- Solution: Check address format

## 🎯 Workflow

### Step 1: Get Your Address
```bash
# Visit: https://www.hiro.so/wallet
# Copy your address (starts with SP)
```

### Step 2: Update .env
```bash
# Edit .env
DEPLOYER_ADDRESS=your_address_here
```

### Step 3: Update Scripts
```javascript
// In write-functions.js
const studentAddress = 'your_student_address';
```

### Step 4: Run Scripts
```bash
# Test on testnet
STACKS_NETWORK=testnet npm run write

# Deploy to mainnet
STACKS_NETWORK=mainnet npm run write
```

## 📊 Address Types

### Deployer Address
- Your main Stacks address
- Used in .env file
- Must have STX for gas fees
- Set in: `DEPLOYER_ADDRESS`

### Student Address
- Address of student receiving credential
- Can be any valid Stacks address
- Used in: `issueCredential()`

### Verifier Address
- Address of verifier
- Must be added by contract owner
- Used in: `addVerifier()`

## 🔐 Security

### Protect Your Private Key
- Never share your private key
- Never commit .env to git
- Use .gitignore to exclude .env

### Use Different Addresses
- Deployer: Your main address
- Students: Different addresses
- Verifiers: Different addresses

### Rotate Keys
- If key is exposed, create new wallet
- Transfer funds to new wallet
- Update .env with new key

## 🧪 Testing Workflow

### 1. Create Test Wallet
```bash
# Visit: https://www.hiro.so/wallet
# Create new wallet for testing
```

### 2. Get Test Address
```bash
# Copy address (starts with SP)
```

### 3. Fund with Testnet STX
```bash
# Visit: https://testnet.stacks.co/faucet
# Enter address
# Receive 500 STX
```

### 4. Update .env
```env
STACKS_NETWORK=testnet
DEPLOYER_ADDRESS=your_test_address
```

### 5. Run Tests
```bash
npm run test:run
STACKS_NETWORK=testnet npm run write
```

## 📝 Address Checklist

- [ ] Created Stacks wallet
- [ ] Copied your address
- [ ] Address starts with SP (testnet) or SM (mainnet)
- [ ] Updated .env with your address
- [ ] Funded account with STX
- [ ] Updated scripts with valid addresses
- [ ] Validated address format

## 🎓 Examples

### Example 1: Register Institution

```javascript
// Valid address
const institutionTxId = await registerInstitution(
  'University of Lagos',
  'Nigeria',
  'REG-UNILAG-2024',
  'https://metadata.example.com/unilag'
);
```

### Example 2: Issue Credential

```javascript
// Use valid student address
const studentAddress = 'SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY';

const credentialResult = await issueCredential(
  studentAddress,
  0,
  'Bachelor of Science',
  'Student data...',
  'https://metadata.example.com/credential'
);
```

### Example 3: Add Verifier

```javascript
// Use valid verifier address
const verifierAddress = 'SP2VCQQ7SNJWJG69H7F0SSU7HSTX7ZC32VTJZGVP';

await addVerifier(verifierAddress);
```

## 🔗 Resources

- [Hiro Wallet](https://www.hiro.so/wallet)
- [Stacks Testnet Faucet](https://testnet.stacks.co/faucet)
- [Stacks Explorer](https://explorer.stacks.co/)
- [Stacks Documentation](https://docs.stacks.co/)

## ✨ Summary

1. **Get Address**: Create wallet at https://www.hiro.so/wallet
2. **Fund Account**: Use testnet faucet for testing
3. **Update .env**: Add your address
4. **Update Scripts**: Use valid addresses in scripts
5. **Run Scripts**: Execute with valid addresses

Always use valid Stacks addresses (starting with SP for testnet or SM for mainnet) in your scripts!
