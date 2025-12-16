#!/usr/bin/env node

const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const fs = require('fs');
require('dotenv').config();

const NETWORK = process.env.STACKS_NETWORK || 'testnet';
const DEPLOYER_KEY = process.env.DEPLOYER_KEY;
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;

if (!DEPLOYER_KEY || !DEPLOYER_ADDRESS) {
  console.error('Error: DEPLOYER_KEY and DEPLOYER_ADDRESS must be set in .env');
  process.exit(1);
}

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

async function deployContract(contractName, contractPath) {
  try {
    console.log(`\n📦 Deploying ${contractName}...`);

    const contractCode = fs.readFileSync(contractPath, 'utf8');

    const txOptions = {
      contractName,
      codeBody: contractCode,
      senderKey: DEPLOYER_KEY,
      network,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractDeploy(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);

    console.log(`✅ ${contractName} deployed!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`❌ Error deploying ${contractName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Certifi Smart Contract Deployment');
  console.log(`Network: ${NETWORK}`);
  console.log(`Deployer: ${DEPLOYER_ADDRESS}\n`);

  try {
    // Deploy institutions contract
    const institutionsTxId = await deployContract(
      'certifi-institutions',
      './contracts/certifi-institutions.clar'
    );

    // Deploy credentials contract
    const credentialsTxId = await deployContract(
      'certifi-credentials',
      './contracts/certifi-credentials.clar'
    );

    console.log('\n✨ Deployment Complete!');
    console.log('\nDeployment Summary:');
    console.log(`- certifi-institutions: ${institutionsTxId}`);
    console.log(`- certifi-credentials: ${credentialsTxId}`);

    // Save deployment info
    const deploymentInfo = {
      network: NETWORK,
      deployer: DEPLOYER_ADDRESS,
      timestamp: new Date().toISOString(),
      contracts: {
        'certifi-institutions': {
          txid: institutionsTxId,
          address: `${DEPLOYER_ADDRESS}.certifi-institutions`,
        },
        'certifi-credentials': {
          txid: credentialsTxId,
          address: `${DEPLOYER_ADDRESS}.certifi-credentials`,
        },
      },
    };

    fs.writeFileSync(
      './deployments/deployment.json',
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log('\n📝 Deployment info saved to deployments/deployment.json');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main();
