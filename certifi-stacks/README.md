# Certifi - Blockchain-Powered Credential Verification

Restoring Global Trust in Academic Credentials

## Overview

Certifi is a revolutionary blockchain-powered platform built on Stacks that restores global trust in academic credentials through:

- **Tamper-Proof Certificates**: Immutable blockchain storage ensures certificates cannot be forged
- **Instant Verification**: Real-time credential verification in seconds, globally accessible 24/7
- **Complete Ecosystem**: Institution registration, student certificate issuance, employer verification tools, and comprehensive audit trails

## The Problem

African academic institutions face a critical trust crisis globally:
- Delayed hiring processes due to lengthy verification procedures
- Millions in fraud losses from fake certificates and credentials
- Loss of opportunities for qualified African graduates
- Erosion of trust in African educational institutions

## The Solution

Certifi leverages blockchain technology to create an immutable, transparent, and instantly verifiable credential system.

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Stacks Blockchain (Bitcoin-Secured)           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │   Institutions   │      │   Credentials    │        │
│  │    Contract      │      │    Contract      │        │
│  └──────────────────┘      └──────────────────┘        │
│         │                           │                   │
│         ├─ Register Institution     ├─ Issue Credential │
│         ├─ Verify Institution       ├─ Verify Credential│
│         └─ Manage Verifiers         └─ Revoke Credential│
│                                                         │
└─────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
    ┌─────────┐              ┌──────────────┐
    │Students │              │ Employers    │
    └─────────┘              └──────────────┘
```

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Clarinet](https://github.com/hirosystems/clarinet)
- [Git](https://git-scm.com/)

## 🚀 Installation

```bash
git clone <repository-url>
cd certifi-stacks
npm install
```

## 📜 Smart Contracts

### certifi-institutions.clar
Manages institution registration and verification:
- `register-institution`: Register a new educational institution
- `add-verifier`: Add a verifier (contract owner only)
- `verify-institution`: Verify an institution's credentials
- `get-institution`: Retrieve institution details
- `is-institution-verified`: Check verification status

### certifi-credentials.clar
Manages credential issuance and verification:
- `issue-credential`: Issue a new credential to a student
- `verify-credential`: Verify a credential's authenticity
- `revoke-credential`: Revoke a credential if needed
- `get-credential`: Retrieve credential details
- `verify-credential-hash`: Verify credential by hash

## 🧪 Testing

Run tests with:

```bash
npm run test
```

Generate coverage report:

```bash
npm run test:report
```

## 📝 Workflow

### Institution Registration
1. Institution registers with Certifi
2. Verifier validates institution credentials
3. Institution becomes verified and can issue credentials

### Credential Issuance
1. Verified institution issues credential to student
2. Credential is stored immutably on blockchain
3. Credential hash is generated for verification

### Credential Verification
1. Employer requests credential verification
2. Credential is verified against blockchain hash
3. Verification result is returned instantly

## 🔐 Security Features

- **Immutable Records**: All credentials stored on Stacks blockchain
- **Cryptographic Hashing**: SHA-256 hashing for credential integrity
- **Access Control**: Role-based permissions for institutions and verifiers
- **Revocation Support**: Credentials can be revoked if needed
- **Audit Trail**: Complete history of all credential operations

## 📊 Key Metrics

- Total institutions registered
- Total credentials issued
- Total credentials revoked
- Active credentials count
- Verification success rate

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🔗 Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Guide](https://docs.stacks.co/clarity)
- [Stacks Explorer](https://explorer.stacks.co/)
