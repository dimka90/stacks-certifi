#!/usr/bin/env node

const { StacksTestnet } = require('@stacks/network');
const {
  makeContractCall,
  broadcastTransaction,
  contractPrincipalCV,
  stringAsciiCV,
  uintCV,
  bufferCV,
  noneCV,
} = require('@stacks/transactions');
const fs = require('fs');
require('dotenv').config();

const NETWORK = new StacksTestnet();
const DEPLOYER_KEY = process.env.DEPLOYER_KEY;
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;

if (!DEPLOYER_KEY || !DEPLOYER_ADDRESS) {
  console.error('Error: DEPLOYER_KEY and DEPLOYER_ADDRESS must be set in .env');
  process.exit(1);
}

async function registerInstitution(name, country, regNumber, metadataUri) {
  try {
    console.log(`\n📚 Registering institution: ${name}`);

    const txOptions = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'certifi-institutions',
      functionName: 'register-institution',
      functionArgs: [
        stringAsciiCV(name),
        stringAsciiCV(country),
        stringAsciiCV(regNumber),
        stringAsciiCV(metadataUri),
      ],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`✅ Institution registered!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error registering institution:', error.message);
    throw error;
  }
}

async function issueCredential(
  studentAddress,
  institutionId,
  credentialType,
  credentialHash,
  metadataUri
) {
  try {
    console.log(`\n🎓 Issuing credential: ${credentialType}`);

    const txOptions = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'certifi-credentials',
      functionName: 'issue-credential',
      functionArgs: [
        contractPrincipalCV(studentAddress, 'certifi-credentials'),
        uintCV(institutionId),
        stringAsciiCV(credentialType),
        bufferCV(Buffer.from(credentialHash, 'hex')),
        noneCV(),
        stringAsciiCV(metadataUri),
      ],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`✅ Credential issued!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error issuing credential:', error.message);
    throw error;
  }
}

async function verifyCredential(credentialId) {
  try {
    console.log(`\n✔️ Verifying credential ID: ${credentialId}`);

    const txOptions = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'certifi-credentials',
      functionName: 'verify-credential',
      functionArgs: [uintCV(credentialId)],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`✅ Credential verified!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error verifying credential:', error.message);
    throw error;
  }
}

async function revokeCredential(credentialId, reason) {
  try {
    console.log(`\n🚫 Revoking credential ID: ${credentialId}`);

    const txOptions = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: 'certifi-credentials',
      functionName: 'revoke-credential',
      functionArgs: [uintCV(credentialId), stringAsciiCV(reason)],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`✅ Credential revoked!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error revoking credential:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🎯 Certifi Interaction Script');
  console.log(`Network: Testnet`);
  console.log(`Deployer: ${DEPLOYER_ADDRESS}\n`);

  try {
    // Example: Register an institution
    await registerInstitution(
      'University of Lagos',
      'Nigeria',
      'REG-UNILAG-001',
      'https://metadata.example.com/unilag'
    );

    // Example: Issue a credential
    // await issueCredential(
    //   'SP2EXAMPLE...',
    //   0,
    //   'Bachelor of Science in Computer Science',
    //   'a'.repeat(64),
    //   'https://metadata.example.com/credential-001'
    // );

    // Example: Verify a credential
    // await verifyCredential(0);

    // Example: Revoke a credential
    // await revokeCredential(0, 'Fraudulent credential');

    console.log('\n✨ Interaction complete!');
  } catch (error) {
    console.error('Interaction failed:', error);
    process.exit(1);
  }
}

main();
