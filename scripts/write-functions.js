#!/usr/bin/env node

const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const {
  makeContractCall,
  broadcastTransaction,
  contractPrincipalCV,
  stringAsciiCV,
  uintCV,
  bufferCV,
  noneCV,
} = require('@stacks/transactions');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const NETWORK_TYPE = process.env.STACKS_NETWORK || 'testnet';
const NETWORK = NETWORK_TYPE === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
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

console.log(`\n${'='.repeat(70)}`);
console.log(`CERTIFI WRITE FUNCTIONS - STATE-CHANGING OPERATIONS`);
console.log(`${'='.repeat(70)}`);
console.log(`Network: ${NETWORK_TYPE.toUpperCase()}`);
console.log(`Deployer: ${DEPLOYER_ADDRESS}\n`);

// ============================================
// INSTITUTION WRITE FUNCTIONS
// ============================================

async function registerInstitution(name, country, regNumber, metadataUri) {
  try {
    console.log(`\n📚 REGISTERING INSTITUTION`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Name: ${name}`);
    console.log(`Country: ${country}`);
    console.log(`Registration Number: ${regNumber}`);
    console.log(`Metadata URI: ${metadataUri}`);

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

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ INSTITUTION REGISTERED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);
    console.log(`⏳ Waiting for confirmation on ${NETWORK_TYPE}...`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error registering institution:`, error.message);
    throw error;
  }
}

async function addVerifier(verifierAddress) {
  try {
    console.log(`\n👤 ADDING VERIFIER`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Verifier Address: ${verifierAddress}`);

    const txOptions = {
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'add-verifier',
      functionArgs: [contractPrincipalCV(verifierAddress, 'certifi-institutions')],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ VERIFIER ADDED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error adding verifier:`, error.message);
    throw error;
  }
}

async function verifyInstitution(institutionId) {
  try {
    console.log(`\n✔️ VERIFYING INSTITUTION`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Institution ID: ${institutionId}`);

    const txOptions = {
      contractAddress: INSTITUTIONS_CONTRACT.split('.')[0],
      contractName: INSTITUTIONS_CONTRACT.split('.')[1],
      functionName: 'verify-institution',
      functionArgs: [uintCV(institutionId)],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ INSTITUTION VERIFIED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error verifying institution:`, error.message);
    throw error;
  }
}

// ============================================
// CREDENTIAL WRITE FUNCTIONS
// ============================================

async function issueCredential(
  studentAddress,
  institutionId,
  credentialType,
  credentialData,
  metadataUri
) {
  try {
    console.log(`\n🎓 ISSUING CREDENTIAL`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Student Address: ${studentAddress}`);
    console.log(`Institution ID: ${institutionId}`);
    console.log(`Credential Type: ${credentialType}`);
    console.log(`Metadata URI: ${metadataUri}`);

    // Validate student address format
    if (!studentAddress || !studentAddress.startsWith('SP') && !studentAddress.startsWith('SM')) {
      throw new Error(`Invalid Stacks address: ${studentAddress}. Must start with SP (testnet) or SM (mainnet)`);
    }

    // Generate SHA-256 hash of credential data
    const credentialHash = crypto
      .createHash('sha256')
      .update(credentialData)
      .digest('hex');

    console.log(`Credential Hash: ${credentialHash}`);

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

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ CREDENTIAL ISSUED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);
    console.log(`Credential Hash: ${credentialHash}`);

    return {
      txid: broadcastResponse.txid,
      hash: credentialHash,
    };
  } catch (error) {
    console.error(`\n❌ Error issuing credential:`, error.message);
    throw error;
  }
}

async function verifyCredential(credentialId) {
  try {
    console.log(`\n✔️ VERIFYING CREDENTIAL`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Credential ID: ${credentialId}`);

    const txOptions = {
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'verify-credential',
      functionArgs: [uintCV(credentialId)],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ CREDENTIAL VERIFIED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error verifying credential:`, error.message);
    throw error;
  }
}

async function revokeCredential(credentialId, reason) {
  try {
    console.log(`\n🚫 REVOKING CREDENTIAL`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`Credential ID: ${credentialId}`);
    console.log(`Reason: ${reason}`);

    const txOptions = {
      contractAddress: CREDENTIALS_CONTRACT.split('.')[0],
      contractName: CREDENTIALS_CONTRACT.split('.')[1],
      functionName: 'revoke-credential',
      functionArgs: [uintCV(credentialId), stringAsciiCV(reason)],
      senderKey: DEPLOYER_KEY,
      network: NETWORK,
      anchorMode: 'onChainOnly',
    };

    console.log(`\n⏳ Creating transaction...`);
    const transaction = await makeContractCall(txOptions);
    
    console.log(`⏳ Broadcasting transaction...`);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    console.log(`\n✅ CREDENTIAL REVOKED!`);
    console.log(`Transaction ID: ${broadcastResponse.txid}`);

    return broadcastResponse.txid;
  } catch (error) {
    console.error(`\n❌ Error revoking credential:`, error.message);
    throw error;
  }
}

// ============================================
// MAIN EXECUTION - EXAMPLE WORKFLOW
// ============================================

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`EXAMPLE WORKFLOW: COMPLETE CREDENTIAL LIFECYCLE`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    // Step 1: Register Institution
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 1: REGISTER INSTITUTION`);
    console.log(`${'='.repeat(70)}`);

    const institutionTxId = await registerInstitution(
      'University of Lagos',
      'Nigeria',
      'REG-UNILAG-2024',
      'https://metadata.example.com/unilag'
    );

    // Step 2: Add Verifier (Optional - only if you have another address)
    // Uncomment to add a verifier
    /*
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 2: ADD VERIFIER`);
    console.log(`${'='.repeat(70)}`);

    const verifierTxId = await addVerifier('SP2VERIFIER_ADDRESS');
    */

    // Step 3: Verify Institution (Optional - requires verifier role)
    // Uncomment to verify institution
    /*
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 3: VERIFY INSTITUTION`);
    console.log(`${'='.repeat(70)}`);

    const verifyInstTxId = await verifyInstitution(0);
    */

    // Step 4: Issue Credential
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 4: ISSUE CREDENTIAL`);
    console.log(`${'='.repeat(70)}`);

    // IMPORTANT: Replace with your actual student address
    // Get a valid address from: https://www.hiro.so/wallet
    // Testnet addresses start with SP, Mainnet with SM
    const studentAddress = process.env.STUDENT_ADDRESS || DEPLOYER_ADDRESS;
    
    if (!studentAddress || studentAddress === 'your_stacks_address_here') {
      console.error('\n❌ ERROR: Please set STUDENT_ADDRESS in .env or use your own Stacks address');
      console.error('Get an address from: https://www.hiro.so/wallet\n');
      process.exit(1);
    }
    
    const credentialResult = await issueCredential(
      studentAddress,
      0, // Institution ID
      'Bachelor of Science in Computer Science',
      'Student: John Doe, Program: BSc CS, Year: 2024, Grade: A',
      'https://metadata.example.com/credential-001'
    );

    // Step 5: Verify Credential
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 5: VERIFY CREDENTIAL`);
    console.log(`${'='.repeat(70)}`);

    const verifyCredTxId = await verifyCredential(0);

    // Step 6: Revoke Credential (Optional - only if needed)
    // Uncomment to revoke credential
    /*
    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP 6: REVOKE CREDENTIAL`);
    console.log(`${'='.repeat(70)}`);

    const revokeTxId = await revokeCredential(0, 'Fraudulent credential');
    */

    // Summary
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ WORKFLOW COMPLETE`);
    console.log(`${'='.repeat(70)}`);
    console.log(`\nTransaction Summary:`);
    console.log(`  1. Register Institution: ${institutionTxId}`);
    console.log(`  2. Issue Credential: ${credentialResult.txid}`);
    console.log(`     Credential Hash: ${credentialResult.hash}`);
    console.log(`  3. Verify Credential: ${verifyCredTxId}`);
    console.log(`\n⏳ Transactions are being processed on ${NETWORK_TYPE}...`);
    console.log(`📊 Monitor on: https://${NETWORK_TYPE === 'mainnet' ? '' : 'testnet-'}explorer.stacks.co/`);

  } catch (error) {
    console.error('\n❌ Workflow failed:', error);
    process.exit(1);
  }
}

// Export functions for use in other scripts
module.exports = {
  registerInstitution,
  addVerifier,
  verifyInstitution,
  issueCredential,
  verifyCredential,
  revokeCredential,
};

// Run main if executed directly
if (require.main === module) {
  main();
}
