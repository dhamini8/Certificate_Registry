const hre = require("hardhat");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();

const checkVerification = async (contractAddress, chainId) => {
  try {
    // Use the correct Sourcify verification URL format
    const verificationUrl = `https://sourcify.dev/#/lookup/${contractAddress}`;
    
    const response = await axios.get(
      `https://sourcify.dev/server/check-by-addresses?addresses=${contractAddress}&chainIds=${chainId}`
    );
    
    // First display detailed verification results
    console.log('\nVerification Status:');
    console.log('==================');
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Network: Sepolia (${chainId})`);
    console.log(`Status: ${response.data[0]?.status || 'Not Found'}`);
    
    // Then show verification summary
    if (response.data[0]?.status === 'perfect') {
      console.log("\n✅ Contract is fully verified on Sourcify!");
    } else if (response.data[0]?.status === 'partial') {
      console.log("\n⚠️ Contract is partially verified on Sourcify");
    } else {
      console.log("\n❌ Contract is not verified on Sourcify");
    }

    console.log('\nVerify manually at:');
    console.log(verificationUrl);
  } catch (error) {
    console.error("❌ Error checking verification:", error.message);
  }
}

async function main() {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const chainId = '11155111'; // Sepolia testnet

    if (!contractAddress) {
      throw new Error("Please set CONTRACT_ADDRESS in your .env file");
    }

    console.log("Starting Sourcify verification...");
    
    // Force a recompilation to ensure fresh metadata
    await hre.run("clean");
    await hre.run("compile");

    // Get the contract artifact and metadata
    const contractName = "CertificateRegistry";
    const buildInfoPath = path.join(
      hre.config.paths.artifacts,
      "build-info"
    );
    
    const buildInfoFiles = fs.readdirSync(buildInfoPath);
    const latestBuildInfo = buildInfoFiles[buildInfoFiles.length - 1];
    const buildInfo = require(path.join(buildInfoPath, latestBuildInfo));

    const metadata = buildInfo.output.contracts["contracts/certificateregistry.sol"][contractName].metadata;
    
    const metadataPath = path.join(__dirname, "metadata.json");
    fs.writeFileSync(metadataPath, metadata);

    const formData = new FormData();
    formData.append('files', fs.createReadStream('./contracts/certificateregistry.sol'));
    formData.append('files', fs.createReadStream(metadataPath));
    formData.append('address', contractAddress);
    formData.append('chain', chainId);

    console.log("Sending verification request...");
    const response = await axios.post('https://sourcify.dev/server/verify', formData, {
      headers: formData.getHeaders()
    });

    console.log("Initial Verification Response:", response.data);

    // Clean up temporary file
    fs.unlinkSync(metadataPath);

    // Check final verification status
    await checkVerification(contractAddress, chainId);

  } catch (error) {
    console.error("Verification failed:", error.message);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });