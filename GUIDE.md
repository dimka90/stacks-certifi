# Certifi - Complete Guide

Blockchain-powered credential verification on Stacks.

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install
npm install

# 2. Setup
cp .env.example .env
# Edit .env with your Stacks address

# 3. Fund testnet (FREE)
# Visit: https://testnet.stacks.co/faucet

# 4. Deploy
npm run deploy

# 5. Use
npm run write
```

## 📋 Setup

### Get Stacks Address
1. Visit: https://www.hiro.so/wallet
2. Create wallet
3. Copy address (starts with SP for testnet, SM for mainnet)
4. Export private key

### Configure .env
```env
STACKS_NETWORK=testnet
DEPLOYER_KEY=your_private_key
DEPLOYER_ADDRESS=your_address
STUDENT_ADDRESS=your_address_or_different
VERIFIER_ADDRESS=verifier_address
```

### Fund Account
- **Testnet**: https://testnet.stacks.co/faucet (FREE)
- **Mainnet**: Buy STX from exchange

## 🎯 Commands

```bash
npm run test:run              # Run tests
npm run deploy                # Deploy contracts
npm run write                 # Execute write functions
npm run mainnet-interact      # Read-only queries (FREE)
npm run interact              # Interact with contracts
npm run addresses             # View test addresses
```

## 📊 What's Included

### Smart Contracts (2)
- **certifi-institutions.clar** - Institution management
- **certifi-credentials.clar** - Credential management

### Functions (30+)
- Register institutions
- Issue credentials
- Verify credentials
- Revoke credentials
- Read-only queries

### Scripts
- `deploy.js` - Deploy contracts
- `write-functions.js` - State-changing operations
- `mainnet-interact.js` - Read-only operations
- `interact.js` - Basic interactions

## 💰 Gas Costs

| Operation | Cost |
|-----------|------|
| Register Institution | 0.01-0.05 STX |
| Issue Credential | 0.01-0.05 STX |
| Verify Credential | 0.01-0.05 STX |
| Revoke Credential | 0.01-0.05 STX |
| Read-Only Calls | FREE |

## 🔄 Workflow

### 1. Register Institution
```bash
# Edit scripts/write-functions.js
# Uncomment registerInstitution()
npm run write
```

### 2. Issue Credential
```bash
# Edit scripts/write-functions.js
# Uncomment issueCredential()
npm run write
```

### 3. Verify Credential
```bash
# Edit scripts/write-functions.js
# Uncomment verifyCredential()
npm run write
```

### 4. Monitor on Explorer
- Testnet: https://testnet-explorer.alexgo.io/
- Mainnet: https://explorer.stacks.co/

## 🔐 Security

- ✅ Private keys in .env (not committed)
- ✅ .env in .gitignore
- ✅ Address validation
- ✅ Error handling
- ✅ Immutable records

## 🧪 Testing

```bash
# Run all tests
npm run test:run

# Watch mode
npm run test

# Coverage
npm run test:report
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Project overview |
| GUIDE.md | This file - complete guide |
| ARCHITECTURE.md | System design |
| DEPLOYMENT.md | Deployment details |
| WRITE_FUNCTIONS_GUIDE.md | Write functions |
| MAINNET_INTERACTION.md | Mainnet operations |
| STACKS_ADDRESSES_GUIDE.md | Address guide |
| QUICK_REFERENCE.md | Quick lookup |
| SETUP_GUIDE.md | Setup instructions |

## 🔗 Resources

- [Stacks Docs](https://docs.stacks.co/)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Hiro Wallet](https://www.hiro.so/wallet)
- [Stacks Explorer](https://explorer.stacks.co/)

## 🚨 Troubleshooting

### "Insufficient balance"
- Fund account with STX

### "Invalid Stacks address"
- Use address starting with SP (testnet) or SM (mainnet)

### "Transaction stuck"
- Wait 30+ minutes or check network status

### "Contract not found"
- Verify deployment completed
- Check deployment.json for addresses

## ✨ Features

✅ 2 Smart Contracts
✅ 20+ Test Cases
✅ Gas-Optimized
✅ Testnet & Mainnet Support
✅ Read-Only & Write Functions
✅ Complete Documentation

## 📁 Project Structure

```
.
├── contracts/              Smart contracts
├── tests/                  Test suite
├── scripts/                Deployment & interaction
├── deployments/            Deployment records
├── .env.example            Environment template
├── package.json            Dependencies
└── [documentation]         Guides
```

## 🎓 Learning Path

1. Read: README.md
2. Setup: GUIDE.md (this file)
3. Deploy: DEPLOYMENT.md
4. Use: WRITE_FUNCTIONS_GUIDE.md

## 📞 Support

1. Check documentation
2. Review error messages
3. Check Stacks community
4. File GitHub issue

---

**Ready to start?** Follow the Quick Start above!
