# Certificate Registry Smart Contract Project

This project implements a certificate management system on the Ethereum blockchain using the Hardhat development environment. It includes intentional vulnerabilities for educational and auditing purposes.

## Project Structure
```
certi/
├── .env                        # Environment variables configuration
├── contracts/
│   └── certificateregistry.sol # Main smart contract with vulnerabilities
├── scripts/
│   ├── audit.js               # Security audit automation script
│   ├── deploy.js              # Deployment script
│   └── verify.js              # Contract verification script
├── hardhat.config.js          # Hardhat and network configuration 
├── package.json               # Project dependencies and scripts
└── readme.md                  # Project documentation
```

## Key Components

- **certificateregistry.sol**
  - Manages certificates (issue, revoke, authorize certifiers).
  - Contains documented vulnerabilities for educational analysis.

- **deploy.js**
  - Deploys the smart contract to the Ethereum testnet.
  - Includes transaction confirmations and error handling.

- **verify.js**
  - Verifies the deployed contract on Etherscan using the API key.

- **audit.js**
  - Automates the execution of the Slither static analysis tool.
  - Outputs a vulnerability summary and raw JSON audit file.

- **certi.js**
  - Contains test cases for validating contract functionality.


## Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Python 3](https://www.python.org/) with pip3
- Wallet with Sepolia testnet ETH
- API keys for Infura and Etherscan


## Environment Setup

Create a `.env` file in the root directory with the following variables:

```ini
INFURA_API_KEY="your_infura_api_key"
PRIVATE_KEY="your_wallet_private_key"
ETHERSCAN_API_KEY="your_etherscan_api_key"
CONTRACT_ADDRESS="deployed_contract_address"
```

### Task-wise Execution Guide

Follow these steps in order to complete all required tasks:

Task 1: Setup and Testing

# Install all dependencies
npm install

# Run the test suite
npx hardhat test

Task 2: Security Analysis
Note: This will be need to install every time as it's not global installation

# Install Slither analyzer
pip3 install slither-analyzer

# Configure PATH for Slither
export PATH=$PATH:$(python3 -m site --user-base)/bin

# Run security audit
npm run audit

Task 3: Deployment and Verification

# Clean and recompile the contract
npx hardhat clean
npx hardhat compile

# Deploy to Sepolia network
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract on Sourcify/Etherscan
npx hardhat run scripts/verify.js --network sepolia

**Important Notes:**
	•	Ensure you have sufficient Sepolia testnet ETH before deployment.
	•	Do not commit your .env file or private keys to version control.
	•	Review the security audit findings carefully before deploying to any network.
	•	The project is for educational use only and includes known security flaws.


**Technical Details**
	•	Solidity Version: ^0.8.0
	•	Network: Sepolia Testnet
	•	Development Framework: Hardhat
	•	Testing Framework: Mocha + Chai


**Dependencies**
	•	hardhat ^2.24.2
	•	ethers ^5.8.0
	•	dotenv ^16.5.0
	•	@nomicfoundation/hardhat-toolbox ^2.0.2
	•	@nomiclabs/hardhat-ethers ^2.2.3


**Security Disclaimer**

This project includes known vulnerabilities such as:
	•	Insecure access control
	•	Lack of constructor initialization
	•	Potential reentrancy risks
	•	Missing zero address checks

DO NOT use this contract in production environments without proper security review and patching.


**License**

MIT License – Free to use for educational purposes.