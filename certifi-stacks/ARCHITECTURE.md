# Certifi Architecture

## System Overview

Certifi is a blockchain-based credential verification system built on Stacks. It consists of two main smart contracts that work together to create an immutable, transparent, and instantly verifiable credential ecosystem.

## Smart Contracts

### 1. certifi-institutions.clar

**Purpose**: Manages educational institution registration and verification

**Key Data Structures**:

```clarity
institutions: {
  institution-id: uint
  name: string-ascii 256
  country: string-ascii 128
  registration-number: string-ascii 128
  owner: principal
  verified: bool
  verified-at: optional uint
  created-at: uint
  metadata-uri: string-ascii 512
}

verifiers: {
  verifier: principal -> bool
}
```

**Key Functions**:

| Function | Type | Access | Description |
|----------|------|--------|-------------|
| `register-institution` | Public | Any | Register a new institution |
| `add-verifier` | Public | Owner | Add a verifier |
| `remove-verifier` | Public | Owner | Remove a verifier |
| `verify-institution` | Public | Verifier | Verify an institution |
| `get-institution` | Read-Only | Any | Get institution details |
| `get-institution-by-owner` | Read-Only | Any | Get institution by owner |
| `is-institution-verified` | Read-Only | Any | Check verification status |
| `get-institution-count` | Read-Only | Any | Get total institutions |
| `get-verified-count` | Read-Only | Any | Get verified count |
| `is-verifier` | Read-Only | Any | Check if user is verifier |

**State Variables**:

- `institution-counter`: Total institutions registered
- `total-verified`: Total verified institutions

### 2. certifi-credentials.clar

**Purpose**: Manages credential issuance, verification, and revocation

**Key Data Structures**:

```clarity
credentials: {
  credential-id: uint
  student: principal
  institution-id: uint
  credential-type: string-ascii 128
  credential-hash: buff 32
  issue-date: uint
  expiry-date: optional uint
  status: uint (0=active, 1=revoked, 2=expired)
  metadata-uri: string-ascii 512
  issued-by: principal
}

credential-by-hash: {
  credential-hash: buff 32 -> credential-id: uint
}

student-credentials: {
  student: principal, index: uint -> credential-id: uint
}

verification-log: {
  credential-id: uint, verifier: principal -> {
    verified-at: uint
    verification-hash: buff 32
  }
}

revocation-log: {
  credential-id: uint -> {
    revoked-at: uint
    revoked-by: principal
    reason: string-ascii 256
  }
}
```

**Key Functions**:

| Function | Type | Access | Description |
|----------|------|--------|-------------|
| `issue-credential` | Public | Any | Issue a credential |
| `verify-credential` | Public | Any | Verify a credential |
| `revoke-credential` | Public | Issuer/Owner | Revoke a credential |
| `get-credential` | Read-Only | Any | Get credential details |
| `get-credential-by-hash` | Read-Only | Any | Get credential by hash |
| `get-student-credential-count` | Read-Only | Any | Get student's credential count |
| `get-student-credential` | Read-Only | Any | Get student's credential by index |
| `is-credential-valid` | Read-Only | Any | Check if credential is valid |
| `get-revocation-info` | Read-Only | Any | Get revocation details |
| `get-verification-info` | Read-Only | Any | Get verification details |
| `verify-credential-hash` | Read-Only | Any | Verify by hash |
| `get-credential-status` | Read-Only | Any | Get credential status |

**State Variables**:

- `credential-counter`: Total credentials issued
- `total-issued`: Total credentials issued
- `total-revoked`: Total credentials revoked

## Data Flow

### Institution Registration Flow

```
Institution Owner
    ↓
register-institution()
    ↓
Create institution record
    ↓
Map owner to institution
    ↓
Increment counter
    ↓
Return institution-id
```

### Institution Verification Flow

```
Verifier
    ↓
verify-institution(institution-id)
    ↓
Check verifier status
    ↓
Update institution verified flag
    ↓
Set verified-at timestamp
    ↓
Increment verified counter
```

### Credential Issuance Flow

```
Institution
    ↓
issue-credential(student, institution-id, type, hash, expiry, metadata)
    ↓
Validate inputs
    ↓
Check hash uniqueness
    ↓
Create credential record
    ↓
Map hash to credential-id
    ↓
Add to student's credentials
    ↓
Increment counters
    ↓
Return credential-id
```

### Credential Verification Flow

```
Employer/Verifier
    ↓
verify-credential-hash(credential-hash)
    ↓
Look up credential by hash
    ↓
Check credential status
    ↓
Return verification result
    ↓
Log verification
```

### Credential Revocation Flow

```
Institution/Owner
    ↓
revoke-credential(credential-id, reason)
    ↓
Check authorization
    ↓
Verify not already revoked
    ↓
Update status to REVOKED
    ↓
Log revocation with reason
    ↓
Increment revoked counter
```

## Error Codes

### Common Errors

| Code | Meaning |
|------|---------|
| u401 | Unauthorized - insufficient permissions |
| u404 | Not found - resource doesn't exist |
| u409 | Conflict - resource already exists |
| u420 | Invalid input - validation failed |
| u421 | Invalid country |
| u422 | Not verified - institution not verified |
| u423 | Already verified |
| u424 | Invalid registration |
| u425 | Verification failed |
| u426 | Invalid student |

## Security Considerations

### Access Control

1. **Institution Registration**: Any principal can register
2. **Institution Verification**: Only designated verifiers
3. **Credential Issuance**: Any principal (typically institutions)
4. **Credential Revocation**: Only issuer or contract owner
5. **Verifier Management**: Only contract owner

### Data Integrity

1. **Immutable Records**: All records stored on blockchain
2. **Hash Verification**: SHA-256 hashing for credential integrity
3. **Audit Trail**: Complete history of all operations
4. **Revocation Support**: Credentials can be marked as revoked

### Validation

1. **Input Validation**: All inputs validated before processing
2. **Uniqueness Checks**: Credential hashes must be unique
3. **Status Checks**: Credentials can't be revoked twice
4. **Authorization Checks**: All sensitive operations require authorization

## Scalability Considerations

### Current Limitations

1. **Map Size**: Clarity maps have practical limits
2. **Batch Operations**: Limited to small batches
3. **Query Complexity**: Complex queries require multiple calls

### Future Improvements

1. **Pagination**: Implement pagination for large datasets
2. **Indexing**: Add secondary indexes for faster lookups
3. **Caching**: Implement off-chain caching layer
4. **Sharding**: Consider contract sharding for scale

## Integration Points

### Frontend Integration

```typescript
// Example: Verify credential
const credentialHash = sha256(credentialData);
const result = await callReadOnly(
  'certifi-credentials',
  'verify-credential-hash',
  [credentialHash]
);
```

### External Services

1. **Metadata Storage**: IPFS or similar for credential metadata
2. **Notification Service**: Email/SMS for credential events
3. **Analytics**: Track verification patterns
4. **Compliance**: Audit trail for regulatory requirements

## Testing Strategy

### Unit Tests

- Individual function behavior
- Error handling
- Edge cases

### Integration Tests

- Contract interactions
- State consistency
- Multi-step workflows

### Test Coverage

- Institution registration and verification
- Credential issuance and revocation
- Credential verification
- Access control
- Error conditions

## Deployment Strategy

### Testnet Deployment

1. Deploy contracts to testnet
2. Run full test suite
3. Verify all functions work
4. Get community feedback

### Mainnet Deployment

1. Security audit
2. Final testing
3. Gradual rollout
4. Monitor for issues

## Future Enhancements

### Phase 2

- Batch credential issuance
- Advanced search capabilities
- Credential expiry handling
- Credential transfer/delegation

### Phase 3

- Cross-chain verification
- Integration with other blockchains
- Advanced analytics
- Compliance reporting

### Phase 4

- AI-powered fraud detection
- Biometric verification
- Real-time credential updates
- Advanced access control

## Performance Metrics

### Current Performance

- Credential issuance: ~1 transaction
- Credential verification: ~1 read-only call
- Institution registration: ~1 transaction
- Verification time: <10 seconds (testnet)

### Optimization Opportunities

1. Batch operations
2. Off-chain indexing
3. Caching layer
4. Query optimization

## Compliance

### Data Privacy

- No PII stored on-chain
- Metadata stored off-chain
- Hash-based verification

### Regulatory

- Audit trail for all operations
- Revocation support for compliance
- Access control for data protection

## Monitoring and Maintenance

### Key Metrics

- Total institutions registered
- Total credentials issued
- Verification success rate
- Revocation rate
- Average verification time

### Maintenance Tasks

- Monitor contract health
- Update verifier list
- Handle disputes
- Security updates

## References

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Bitcoin Security Model](https://bitcoin.org/)
