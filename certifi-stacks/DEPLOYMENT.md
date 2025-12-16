# Certifi Deployment Guide

Complete guide for deploying Certifi to Stacks testnet and mainnet.

## Prerequisites

- Node.js v16+
- Stacks wallet with STX for gas fees
- Private key from your Stacks wallet
- Stacks address

## Environment Setup

### 1. Create .env File

```bash
cp .env.example .env
```

### 2. Configure .env

```env
STACKS_NETWORK=testnet
DEPLOYER_KEY=your_private_key_here
DEPLOYER_ADDRESS=your_stacks_address_here
```

**Getting Your Keys**:

1. Create a Stacks wallet at [Stacks Wallet](https://www.hiro.so/wallet)
2. Export your private key (keep it secure!)
3. Get your Stacks address (starts with `SP` for testnet, `SM` for mainnet)

### 3. Fund Your Account

**Testnet**:
- Use [Stacks Testnet Faucet](https://testnet.stacks.co/faucet)
- Request STX tokens

**Mainnet**:
- Purchase STX from exchange
- Transfer to your Stacks address

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify Contracts

```bash
clarinet check
```

This validates contract syntax and catches errors early.

### 3. Run Tests

```bash
npm run test:run
```

Ensure all tests pass before deployment.

### 4. Deploy Contracts

```bash
npm run deploy
```

This will:
- Deploy `certifi-institutions` contract
- Deploy `certifi-credentials` contract
- Save deployment info to `deployments/deployment.json`

### 5. Verify Deployment

Check the deployment info:

```bash
cat deployments/deployment.json
```

You should see:
- Transaction IDs for both contracts
- Contract addresses
- Deployment timestamp

## Testnet Deployment

### Step-by-Step

1. **Set network to testnet**:
   ```env
   STACKS_NETWORK=testnet
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   ```

3. **Monitor deployment**:
   - Check [Stacks Testnet Explorer](https://testnet-explorer.alexgo.io/)
   - Search for your transaction ID
   - Wait for confirmation (usually 10-30 minutes)

4. **Verify contracts**:
   ```bash
   npm run interact
   ```

### Testnet Faucet

Get free STX for testing:

```bash
# Visit: https://testnet.stacks.co/faucet
# Enter your Stacks address
# Receive 500 STX
```

## Mainnet Deployment

### Pre-Deployment Checklist

- [ ] Contracts tested thoroughly on testnet
- [ ] Security audit completed
- [ ] All tests passing
- [ ] Deployment plan documented
- [ ] Rollback plan prepared
- [ ] Sufficient STX for gas fees

### Deployment Process

1. **Update .env for mainnet**:
   ```env
   STACKS_NETWORK=mainnet
   DEPLOYER_KEY=your_private_key
   DEPLOYER_ADDRESS=your_mainnet_address
   ```

2. **Final verification**:
   ```bash
   npm run test:run
   clarinet check
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Monitor**:
   - Check [Stacks Mainnet Explorer](https://explorer.stacks.co/)
   - Wait for confirmation
   - Verify contract functionality

### Mainnet Considerations

- **Gas Fees**: Higher on mainnet, budget accordingly
- **Confirmation Time**: 10-30 minutes typical
- **Irreversible**: Mainnet deployments are permanent
- **Monitoring**: Watch for any issues post-deployment

## Post-Deployment

### 1. Verify Contracts

```bash
# Check contract exists
curl https://api.mainnet.stacks.co/v1/contracts/address/CONTRACT_ADDRESS/CONTRACT_NAME

# Call read-only function
npm run interact
```

### 2. Initialize System

```bash
# Add verifiers
# Register test institutions
# Issue test credentials
```

### 3. Monitor

- Watch transaction confirmations
- Monitor contract calls
- Track gas usage
- Monitor for errors

### 4. Documentation

Update deployment records:

```json
{
  "network": "mainnet",
  "deployer": "SM...",
  "timestamp": "2024-01-01T00:00:00Z",
  "contracts": {
    "certifi-institutions": {
      "txid": "0x...",
      "address": "SM....certifi-institutions"
    },
    "certifi-credentials": {
      "txid": "0x...",
      "address": "SM....certifi-credentials"
    }
  }
}
```

## Troubleshooting

### Deployment Fails

**Issue**: "Insufficient balance"
- **Solution**: Fund your account with more STX

**Issue**: "Invalid private key"
- **Solution**: Check .env file, ensure key is correct

**Issue**: "Contract already exists"
- **Solution**: Use different contract name or address

### Transaction Stuck

**Issue**: Transaction pending for hours
- **Solution**: 
  1. Check network status
  2. Increase gas price
  3. Resubmit transaction

### Contract Not Found

**Issue**: Contract not appearing on explorer
- **Solution**:
  1. Wait for confirmation
  2. Check correct address
  3. Verify on correct network

## Gas Estimation

### Typical Gas Costs

| Operation | Estimated STX |
|-----------|---------------|
| Deploy contract | 0.1 - 0.5 STX |
| Register institution | 0.01 - 0.05 STX |
| Issue credential | 0.01 - 0.05 STX |
| Verify credential | 0 STX (read-only) |
| Revoke credential | 0.01 - 0.05 STX |

### Optimizing Gas

1. **Batch operations**: Combine multiple calls
2. **Read-only calls**: Use for verification (free)
3. **Off-chain data**: Store metadata off-chain
4. **Contract optimization**: Minimize storage operations

## Rollback Plan

### If Issues Occur

1. **Stop new deployments**
2. **Assess impact**
3. **Communicate with users**
4. **Deploy fix**
5. **Verify fix**
6. **Resume operations**

### Backup Contracts

Keep previous versions:

```bash
# Archive old contracts
cp contracts/certifi-credentials.clar contracts/certifi-credentials.v1.clar
```

## Monitoring Post-Deployment

### Key Metrics

- Transaction success rate
- Average gas usage
- Error rates
- User adoption

### Tools

- [Stacks Explorer](https://explorer.stacks.co/)
- [Stacks API](https://docs.stacks.co/api)
- Custom monitoring dashboard

### Alerts

Set up alerts for:
- Failed transactions
- High gas usage
- Unusual activity
- Contract errors

## Maintenance

### Regular Tasks

- Monitor contract health
- Update verifier list
- Handle disputes
- Security patches

### Upgrade Path

For future upgrades:

1. Deploy new contract version
2. Migrate data if needed
3. Update frontend
4. Deprecate old contract
5. Archive old data

## Support

### Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Guide](https://docs.stacks.co/clarity)
- [Community Discord](https://discord.gg/stacks)
- [GitHub Issues](https://github.com/stacks-network/stacks-blockchain)

### Getting Help

1. Check documentation
2. Search GitHub issues
3. Ask in community Discord
4. File GitHub issue

## Checklist

### Pre-Deployment

- [ ] Environment configured
- [ ] Tests passing
- [ ] Contracts verified
- [ ] Account funded
- [ ] Backup created

### Deployment

- [ ] Deploy contracts
- [ ] Verify deployment
- [ ] Check explorer
- [ ] Document addresses

### Post-Deployment

- [ ] Initialize system
- [ ] Monitor transactions
- [ ] Update documentation
- [ ] Notify users
- [ ] Set up monitoring

## Next Steps

1. ✅ Deploy to testnet
2. ✅ Test thoroughly
3. ✅ Get community feedback
4. ✅ Security audit
5. ✅ Deploy to mainnet
6. ✅ Monitor and maintain

Good luck with your deployment! 🚀
