#!/usr/bin/env node

const { StacksMainnet } = require('@stacks/network');
const {
  makeContractCall,
  broadcastTransaction,
  contractPrincipalCV,
  stringAsciiCV,
  uintCV,
  bufferCV,
  noneCV,
  callReadOnlyFunction,
} = require('@stacks/transactions');
const fs = require('fs');
require('dotenv').config();

const NETWORK = new StacksMainnet();
const DEPLOYER_KEY = process.env.DEPLOYER_KEY;
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;

if (!DEPLOYER_KEY || !DEPLOYER_ADDRESS) {
  console.error('Error: DEPLOYER_KEY and DEPLOYER_ADDRESS must be set in .env');
  process.exit(1);
}

// Load deployment info
let deploymentInfo = {};
try {
  deploymentInfo = JSON.parse(fs.readFileSync('./deployments/deployment.json', 'utf8'));
} catch (error) {
  console.error('Error: Could not load deployment.json. Deploy contracts first.');
  process.exit(1);
}

const INSTITUTIONS_CONTRACT = deploymentInfo.contracts['certifi-institutions'].address;
const CREDENTIALS_CONTRACT = deploymentInfo.contracts['certifi-credentials'].address;

console.log(`\n🌐 MAINNET INTERACTION SCRIPT`);
console.log(`Network: Mainnet`);
console.log(`Deployer: ${DEPLOYER_ADDRESS}\n`);

// ============================================
// READ-ONLY FUNCTIONS (FREE - NO GAS)
// ============================================

async function getInstitutionCount() {
  try {
    console.log(`\n📊 Getting institution count...`);

    const result = await callReadOnlyFunction({
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'get-institution-count',
      functionArgs: [],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Total institutions: ${result.result}`);
    return result.result;
  } catch (error) {
    console.error('Error getting institution count:', error.message);
  }
}

async function getVerifiedCount() {
  try {
    console.log(`\n📊 Getting verified institutions count...`);

    const result = await callReadOnlyFunction({
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'get-verified-count',
      functionArgs: [],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Total verified: ${result.result}`);
    return result.result;
  } catch (error) {
    console.error('Error getting verified count:', error.message);
  }
}

async function getInstitution(institutionId) {
  try {
    console.log(`\n🏫 Getting institution details (ID: ${institutionId})...`);

    const result = await callReadOnlyFunction({
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'get-institution',
      functionArgs: [uintCV(institutionId)],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Institution details:`, result.result);
    return result.result;
  } catch (error) {
    console.error('Error getting institution:', error.message);
  }
}

async function getTotalIssued() {
  try {
    console.log(`\n📜 Getting total credentials issued...`);

    const result = await callReadOnlyFunction({
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'get-total-issued',
      functionArgs: [],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Total issued: ${result.result}`);
    return result.result;
  } catch (error) {
    console.error('Error getting total issued:', error.message);
  }
}

async function getTotalRevoked() {
  try {
    console.log(`\n📜 Getting total credentials revoked...`);

    const result = await callReadOnlyFunction({
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'get-total-revoked',
      functionArgs: [],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Total revoked: ${result.result}`);
    return result.result;
  } catch (error) {
    console.error('Error getting total revoked:', error.message);
  }
}

async function getTotalActive() {
  try {
    console.log(`\n📜 Getting total active credentials...`);

    const result = await callReadOnlyFunction({
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'get-total-active',
      functionArgs: [],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Total active: ${result.result}`);
    return result.result;
  } catch (error) {
    console.error('Error getting total active:', error.message);
  }
}

async function getCredential(credentialId) {
  try {
    console.log(`\n🎓 Getting credential details (ID: ${credentialId})...`);

    const result = await callReadOnlyFunction({
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'get-credential',
      functionArgs: [uintCV(credentialId)],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Credential details:`, result.result);
    return result.result;
  } catch (error) {
    console.error('Error getting credential:', error.message);
  }
}

async function verifyCredentialHash(credentialHash) {
  try {
    console.log(`\n✔️ Verifying credential by hash...`);

    const result = await callReadOnlyFunction({
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'verify-credential-hash',
      functionArgs: [bufferCV(Buffer.from(credentialHash, 'hex'))],
      senderAddress: DEPLOYER_ADDRESS,
      network: NETWORK,
    });

    console.log(`✅ Verification result:`, result.result);
    return result.result;
  } catch (error) {
    console.error('Error verifying credential hash:', error.message);
  }
}

// ============================================
// STATE-CHANGING FUNCTIONS (COSTS GAS)
// Use sparingly on mainnet!
// ============================================

async function registerInstitution(name, country, regNumber, metadataUri) {
  try {
    console.log(`\n📚 Registering institution: ${name}`);
    console.log(`⚠️  WARNING: This will consume gas on mainnet!`);

    const txOptions = {
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
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
    console.log(`⏳ Waiting for confirmation on mainnet...`);

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
    console.log(`⚠️  WARNING: This will consume gas on mainnet!`);

    const txOptions = {
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'issue-credential',
      functionArgs: [
        contractPrincipalCV(studentAddress, CREDENTIALS_CONTRACT.split('.')[1]),
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
    console.log(`⏳ Waiting for confirmation on mainnet...`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error('Error issuing credential:', error.message);
    throw error;
  }
}

async function verifyCredential(credentialId) {
  try {
    console.log(`\n✔️ Verifying credential ID: ${credentialId}`);
    console.log(`⚠️  WARNING: This will consume gas on mainnet!`);

    const txOptions = {
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
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
    console.log(`⚠️  WARNING: This will consume gas on mainnet!`);

    const txOptions = {
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
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

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`CERTIFI MAINNET INTERACTION - GAS-OPTIMIZED`);
  console.log(`${'='.repeat(70)}`);

  console.log(`\n📋 AVAILABLE OPERATIONS:\n`);
  console.log(`FREE (Read-Only - No Gas):`);
  console.log(`  1. Get institution count`);
  console.log(`  2. Get verified institutions count`);
  console.log(`  3. Get institution details`);
  console.log(`  4. Get total credentials issued`);
  console.log(`  5. Get total credentials revoked`);
  console.log(`  6. Get total active credentials`);
  console.log(`  7. Get credential details`);
  console.log(`  8. Verify credential by hash`);

  console.log(`\nCOSTS GAS (State-Changing):`);
  console.log(`  9. Register institution`);
  console.log(`  10. Issue credential`);
  console.log(`  11. Verify credential`);
  console.log(`  12. Revoke credential`);

  console.log(`\n${'='.repeat(70)}\n`);

  try {
    // Run read-only queries (FREE - NO GAS)
    console.log(`\n🔍 RUNNING READ-ONLY QUERIES (FREE)\n`);
    console.log(`${'='.repeat(70)}`);

    await getInstitutionCount();
    await getVerifiedCount();
    await getTotalIssued();
    await getTotalRevoked();
    await getTotalActive();

    // Example: Get first institution if it exists
    await getInstitution(0);

    // Example: Verify credential by hash (if you have one)
    // const exampleHash = 'a'.repeat(64);
    // await verifyCredentialHash(exampleHash);

    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ READ-ONLY QUERIES COMPLETE (NO GAS CONSUMED)`);
    console.log(`${'='.repeat(70)}`);

    // Uncomment below to perform state-changing operations (COSTS GAS)
    // WARNING: Only use these when necessary on mainnet!

    /*
    console.log(`\n⚠️  STATE-CHANGING OPERATIONS (COSTS GAS)\n`);
    console.log(`${'='.repeat(70)}`);

    // Example: Register institution
    // await registerInstitution(
    //   'University of Example',
    //   'Country',
    //   'REG-001',
    //   'https://metadata.example.com/uni'
    // );

    // Example: Issue credential
    // await issueCredential(
    //   'SP2STUDENT_ADDRESS',
    //   0,
    //   'Bachelor of Science',
    //   'a'.repeat(64),
    //   'https://metadata.example.com/credential'
    // );

    // Example: Verify credential
    // await verifyCredential(0);

    // Example: Revoke credential
    // await revokeCredential(0, 'Fraudulent credential');

    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ STATE-CHANGING OPERATIONS COMPLETE`);
    console.log(`${'='.repeat(70)}`);
    */

    console.log(`\n✨ Interaction complete!\n`);
  } catch (error) {
    console.error('Interaction failed:', error);
    process.exit(1);
  }
}

main();
