#!/usr/bin/env node

/**
 * Generate valid Stacks test addresses for use in scripts
 * These are example addresses that can be used for testing
 */

const testAddresses = {
  testnet: {
    student1: 'SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY',
    student2: 'SP3PBR02Z2GMTG8ZK685D87AMCNSTW434P4AQJVQ',
    student3: 'SPNWZ5B2STRONRQR4BTWD8F3FEBZYHQD7JBS4ZP',
    verifier1: 'SP2VCQQ7SNJWJG69H7F0SSU7HSTX7ZC32VTJZGVP',
    verifier2: 'SP1YJXE50CYNEJ4P4W5QP44GAJ16G2NRKKS2QH58',
  },
  mainnet: {
    // Mainnet addresses would be different (start with SM)
    // These are examples only
    student1: 'SM2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY',
    student2: 'SM3PBR02Z2GMTG8ZK685D87AMCNSTW434P4AQJVQ',
  },
};

console.log(`\n${'='.repeat(70)}`);
console.log(`STACKS TEST ADDRESSES`);
console.log(`${'='.repeat(70)}\n`);

console.log(`TESTNET ADDRESSES (for testing):\n`);
console.log(`Students:`);
Object.entries(testAddresses.testnet).forEach(([key, address]) => {
  if (key.startsWith('student')) {
    console.log(`  ${key}: ${address}`);
  }
});

console.log(`\nVerifiers:`);
Object.entries(testAddresses.testnet).forEach(([key, address]) => {
  if (key.startsWith('verifier')) {
    console.log(`  ${key}: ${address}`);
  }
});

console.log(`\n${'='.repeat(70)}`);
console.log(`USAGE IN SCRIPTS:\n`);

console.log(`In write-functions.js:`);
console.log(`  const studentAddress = '${testAddresses.testnet.student1}';`);
console.log(`  const verifierAddress = '${testAddresses.testnet.verifier1}';\n`);

console.log(`In mainnet-interact.js:`);
console.log(`  await addVerifier('${testAddresses.testnet.verifier1}');\n`);

console.log(`${'='.repeat(70)}`);
console.log(`IMPORTANT NOTES:\n`);
console.log(`1. These are example addresses for testing only`);
console.log(`2. Replace with your actual Stacks addresses for production`);
console.log(`3. Testnet addresses start with 'SP'`);
console.log(`4. Mainnet addresses start with 'SM'`);
console.log(`5. Get your address from: https://www.hiro.so/wallet\n`);

console.log(`${'='.repeat(70)}\n`);

module.exports = testAddresses;
