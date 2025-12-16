# Certifi Quick Start Guide

Get up and running with Certifi in minutes.

## Prerequisites

- Node.js v16+
- Clarinet CLI
- Git

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd certifi-stacks

# Install dependencies
npm install
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:report
```

## Local Development

### 1. Start Clarinet Console

```bash
clarinet console
```

### 2. Test Contracts Interactively

In the Clarinet console:

```clarity
;; Register an institution
(contract-call? .certifi-institutions register-institution
  "University of Lagos"
  "Nigeria"
  "REG-001"
  "https://metadata.example.com/unilag")

;; Get institution count
(contract-call? .certifi-institutions get-institution-count)

;; Get institution details
(contract-call? .certifi-institutions get-institution u0)
```

## Deployment

### 1. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Stacks credentials:

```
STACKS_NETWORK=testnet
DEPLOYER_KEY=your_private_key
DEPLOYER_ADDRESS=your_stacks_address
```

### 2. Deploy Contracts

```bash
npm run deploy
```

This will:
- Deploy both smart contracts
- Save deployment info to `deployments/deployment.json`

### 3. Interact with Contracts

```bash
npm run interact
```

## Project Structure

```
certifi-stacks/
├── contracts/
│   ├── certifi-institutions.clar    # Institution management
│   └── certifi-credentials.clar     # Credential management
├── tests/
│   ├── certifi-institutions.test.ts
│   └── certifi-credentials.test.ts
├── scripts/
│   ├── deploy.js                    # Deployment script
│   └── interact.js                  # Interaction script
├── deployments/                     # Deployment records
├── Clarinet.toml                    # Project config
└── README.md                        # Full documentation
```

## Key Contracts

### certifi-institutions.clar

Manages educational institutions:

- `register-institution`: Register a new institution
- `add-verifier`: Add a verifier (owner only)
- `verify-institution`: Verify an institution
- `get-institution`: Get institution details
- `is-institution-verified`: Check verification status

### certifi-credentials.clar

Manages academic credentials:

- `issue-credential`: Issue a credential to a student
- `verify-credential`: Verify a credential
- `revoke-credential`: Revoke a credential
- `get-credential`: Get credential details
- `verify-credential-hash`: Verify by hash

## Common Tasks

### Register an Institution

```bash
# In Clarinet console
(contract-call? .certifi-institutions register-institution
  "Your University"
  "Country"
  "REG-NUMBER"
  "https://metadata-uri")
```

### Issue a Credential

```bash
# In Clarinet console
(contract-call? .certifi-credentials issue-credential
  'SP2STUDENT_ADDRESS
  u0
  "Bachelor of Science"
  0x<credential-hash>
  none
  "https://metadata-uri")
```

### Verify a Credential

```bash
# In Clarinet console
(contract-call? .certifi-credentials verify-credential u0)
```

## Troubleshooting

### Tests Failing

1. Ensure Clarinet is installed: `clarinet --version`
2. Clear cache: `rm -rf .cache`
3. Reinstall dependencies: `npm install`

### Deployment Issues

1. Check `.env` file is configured correctly
2. Ensure you have STX for gas fees
3. Verify network connectivity

### Contract Errors

1. Check contract syntax: `clarinet check`
2. Review error codes in contract comments
3. Check test files for usage examples

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Guide](https://docs.stacks.co/clarity)
- [Stacks Explorer](https://explorer.stacks.co/)
- [Clarinet Documentation](https://github.com/hirosystems/clarinet)

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review contract documentation
3. Consult Stacks community resources

## Next Steps

1. ✅ Run tests to verify setup
2. ✅ Explore contracts in Clarinet console
3. ✅ Deploy to testnet
4. ✅ Build frontend integration
5. ✅ Deploy to mainnet

Happy building! 🚀
