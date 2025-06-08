const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function updateEnvFile(contractAddress) {
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace existing CONTRACT_ADDRESS or append new one
  if (envContent.includes('CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS="${contractAddress}"`
    );
  } else {
    envContent += `\nCONTRACT_ADDRESS="${contractAddress}"`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('Updated CONTRACT_ADDRESS in .env file');
}

async function main() {
  try {
    // Deploy contract
    console.log("Deploying CertificateRegistry...");
    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const registry = await CertificateRegistry.deploy();
    await registry.deployed();

    console.log(`CertificateRegistry deployed to: ${registry.address}`);
    
    // Wait for few block confirmations
    console.log("Waiting for block confirmations...");
    await registry.deployTransaction.wait(6);

    // Update .env file with new contract address
    await updateEnvFile(registry.address);
    
    return registry.address;
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then((address) => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });