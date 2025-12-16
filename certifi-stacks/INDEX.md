# Certifi Project Index

Complete guide to all files and resources in the Certifi project.

## 📋 Quick Navigation

### Getting Started
- **[README.md](README.md)** - Project overview and introduction
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in minutes
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project summary

### Documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for testnet/mainnet
- **[INDEX.md](INDEX.md)** - This file

### Configuration
- **[Clarinet.toml](Clarinet.toml)** - Clarinet project configuration
- **[package.json](package.json)** - Node.js dependencies
- **[tsconfig.json](tsconfig.json)** - TypeScript configuration
- **[vitest.config.ts](vitest.config.ts)** - Test configuration
- **[.env.example](.env.example)** - Environment variables template
- **[.gitignore](.gitignore)** - Git ignore rules
- **[LICENSE](LICENSE)** - ISC License

## 📁 Directory Structure

### `/contracts` - Smart Contracts
Clarity smart contracts implementing the core functionality.

- **[certifi-institutions.clar](contracts/certifi-institutions.clar)** (500+ lines)
  - Institution registration and management
  - Verifier role management
  - Institution verification workflow
  - Key functions: `register-institution`, `verify-institution`, `add-verifier`

- **[certifi-credentials.clar](contracts/certifi-credentials.clar)** (600+ lines)
  - Credential issuance and management
  - Credential verification by hash
  - Credential revocation with audit trail
  - Key functions: `issue-credential`, `verify-credential`, `revoke-credential`

### `/tests` - Test Suite
Comprehensive test coverage using Vitest.

- **[certifi-institutions.test.ts](tests/certifi-institutions.test.ts)**
  - Institution registration tests
  - Verifier management tests
  - Institution verification tests
  - Read-only function tests

- **[certifi-credentials.test.ts](tests/certifi-credentials.test.ts)**
  - Credential issuance tests
  - Credential verification tests
  - Credential revocation tests
  - Student credential tracking tests

### `/scripts` - Deployment & Interaction
Node.js scripts for deployment and contract interaction.

- **[deploy.js](scripts/deploy.js)**
  - Deploys both smart contracts
  - Saves deployment information
  - Supports testnet and mainnet

- **[interact.js](scripts/interact.js)**
  - Example contract interactions
  - Institution registration
  - Credential issuance
  - Credential verification

### `/deployments` - Deployment Records
Stores deployment information and transaction records.

- `deployment.json` - Generated after deployment with contract addresses and transaction IDs

### `/settings` - Project Settings
Additional project configuration files.

## 🚀 Quick Commands

### Setup
```bash
npm install                    # Install dependencies
clarinet check                 # Verify contracts
```

### Testing
```bash
npm run test                   # Run tests in watch mode
npm run test:run               # Run tests once
npm run test:report            # Generate coverage report
```

### Development
```bash
clarinet console               # Start interactive console
npm run interact               # Run interaction script
```

### Deployment
```bash
npm run deploy                 # Deploy contracts
```

## 📚 Documentation Map

### For New Users
1. Start with [README.md](README.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Run tests: `npm run test:run`
4. Explore contracts in Clarinet console

### For Developers
1. Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review smart contracts in `/contracts`
3. Study tests in `/tests`
4. Check deployment scripts in `/scripts`

### For Deployment
1. Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. Configure `.env` file
3. Run `npm run deploy`
4. Verify on explorer

### For Integration
1. Review contract functions in [ARCHITECTURE.md](ARCHITECTURE.md)
2. Check interaction examples in [scripts/interact.js](scripts/interact.js)
3. Use contract addresses from `deployments/deployment.json`

## 🔍 File Reference

### Smart Contracts

| File | Lines | Purpose |
|------|-------|---------|
| certifi-institutions.clar | 500+ | Institution management |
| certifi-credentials.clar | 600+ | Credential management |

### Tests

| File | Tests | Coverage |
|------|-------|----------|
| certifi-institutions.test.ts | 10+ | Registration, verification, access control |
| certifi-credentials.test.ts | 10+ | Issuance, verification, revocation |

### Scripts

| File | Purpose |
|------|---------|
| deploy.js | Contract deployment |
| interact.js | Contract interaction examples |

### Configuration

| File | Purpose |
|------|---------|
| Clarinet.toml | Clarinet project config |
| package.json | Node.js dependencies |
| tsconfig.json | TypeScript config |
| vitest.config.ts | Test runner config |

### Documentation

| File | Purpose |
|------|---------|
| README.md | Project overview |
| QUICKSTART.md | Quick start guide |
| ARCHITECTURE.md | System architecture |
| DEPLOYMENT.md | Deployment guide |
| PROJECT_SUMMARY.md | Project summary |
| INDEX.md | This file |

## 🎯 Key Concepts

### Institutions
- Educational institutions register with Certifi
- Verifiers validate institution credentials
- Verified institutions can issue credentials

### Credentials
- Credentials are issued to students by institutions
- Each credential has a unique cryptographic hash
- Credentials can be verified by hash
- Credentials can be revoked if needed

### Verification
- Employers verify credentials by hash
- Verification is instant and free (read-only)
- Complete audit trail maintained
- Revocation status tracked

## 🔐 Security

- **Immutable Records**: Stored on Stacks blockchain
- **Cryptographic Hashing**: SHA-256 for integrity
- **Access Control**: Role-based permissions
- **Audit Trail**: All operations logged
- **Revocation Support**: Credentials can be revoked

## 📊 Project Statistics

- **Smart Contracts**: 2
- **Total Code Lines**: 1,100+
- **Functions**: 30+
- **Data Structures**: 8
- **Test Cases**: 20+
- **Documentation Pages**: 6

## 🔗 External Resources

### Stacks
- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Stacks Explorer](https://explorer.stacks.co/)

### Development
- [Clarinet](https://github.com/hirosystems/clarinet)
- [Vitest](https://vitest.dev/)
- [Node.js](https://nodejs.org/)

### Community
- [Stacks Discord](https://discord.gg/stacks)
- [GitHub Issues](https://github.com/stacks-network/stacks-blockchain)

## 📝 Common Tasks

### Run Tests
```bash
npm run test:run
```

### Deploy to Testnet
```bash
# 1. Configure .env
cp .env.example .env
# 2. Edit .env with testnet credentials
# 3. Deploy
npm run deploy
```

### Deploy to Mainnet
```bash
# 1. Configure .env for mainnet
# 2. Ensure sufficient STX for gas
# 3. Deploy
npm run deploy
```

### Verify Deployment
```bash
# Check deployment info
cat deployments/deployment.json

# Verify on explorer
# https://explorer.stacks.co/
```

### Interact with Contracts
```bash
# Start console
clarinet console

# Example: Get institution count
(contract-call? .certifi-institutions get-institution-count)
```

## 🚦 Status

- ✅ Smart contracts implemented
- ✅ Tests written and passing
- ✅ Documentation complete
- ✅ Deployment scripts ready
- ⏳ Ready for testnet deployment
- ⏳ Ready for mainnet deployment

## 📞 Support

### Getting Help
1. Check [README.md](README.md)
2. Review [QUICKSTART.md](QUICKSTART.md)
3. Check [ARCHITECTURE.md](ARCHITECTURE.md)
4. Review test files for examples
5. Check Stacks community resources

### Reporting Issues
1. Check existing issues
2. Provide detailed description
3. Include error messages
4. Share relevant code

## 🎓 Learning Path

### Beginner
1. Read [README.md](README.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Run tests
4. Explore Clarinet console

### Intermediate
1. Study [ARCHITECTURE.md](ARCHITECTURE.md)
2. Review smart contracts
3. Understand data structures
4. Study test cases

### Advanced
1. Deploy to testnet
2. Integrate with frontend
3. Deploy to mainnet
4. Monitor and maintain

## 📅 Version History

- **v1.0.0** (December 2024)
  - Initial release
  - Two smart contracts
  - Complete test suite
  - Full documentation

## 📄 License

ISC License - See [LICENSE](LICENSE) file

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Ready for Deployment ✅
