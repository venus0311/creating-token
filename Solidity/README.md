# Rexas Token Launchpad

A comprehensive token deployment and management system with advanced DeFi features including reflection, liquidity provision, treasury fees, and burn mechanisms.

## 🚀 Features

### RexasErc20 Token Contract
- **Reflection Mechanism**: Redistributes fees to all holders
- **Automatic Liquidity**: Swaps tokens for ETH and adds liquidity to Uniswap V2
- **Treasury Fees**: Sends a portion of transactions to a treasury address
- **Burn Mechanism**: Reduces total supply with each transaction
- **Fee Exclusions**: Owner can exclude addresses from fees
- **Configurable Fees**: All fees can be set in basis points (0.01%)
- **Conditional Fees**: Fees can apply only to DEX trades or all transfers

### FeeReceiver Contract
- **Service Fee Collection**: Collects fees during token deployment
- **Token Registry**: Tracks all deployed tokens
- **User Management**: Manages tokens by creator
- **Analytics**: Provides comprehensive analytics
- **Emergency Functions**: Can recover stuck assets

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat
- MetaMask or similar wallet

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Rexas_Launchpad
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Hardhat and required packages**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Private Key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
MAINNET_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your_api_key
GOERLI_RPC_URL=https://eth-goerli.alchemyapi.io/v2/your_api_key
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key

# Gas Reporting
REPORT_GAS=true

# Network Configuration
NETWORK=localhost
```

## 🚀 Quick Start

### 1. Deploy FeeReceiver Contract

```bash
npx hardhat run deploy-fee-receiver.js --network localhost
```

### 2. Deploy a Token

```bash
npx hardhat run deploy-token.js --network localhost
```

### 3. Complete Setup (Recommended)

```bash
npx hardhat run complete-setup.js --network localhost
```

## 📖 Usage Examples

### Deploy FeeReceiver

```javascript
const { ethers } = require("hardhat");

async function deployFeeReceiver() {
  const FeeReceiver = await ethers.getContractFactory("FeeReceiver");
  const feeReceiver = await FeeReceiver.deploy();
  await feeReceiver.deployed();
  
  console.log("FeeReceiver deployed to:", feeReceiver.address);
  return feeReceiver.address;
}
```

### Deploy Token with Custom Configuration

```javascript
const { ethers } = require("hardhat");

async function deployToken(feeReceiverAddress) {
  const RexasErc20 = await ethers.getContractFactory("RexasErc20");
  
  const feeSettings = {
    reflectionFeeBps: 200,      // 2%
    applyReflectionFeeToAll: false,
    liquidityFeeBps: 300,       // 3%
    applyLiquidityFeeToAll: false,
    treasuryFeeBps: 100,        // 1%
    applyTreasuryFeeToAll: false,
    burnFeeBps: 50,             // 0.5%
    applyBurnFeeToAll: false
  };
  
  const token = await RexasErc20.deploy(
    "My Token",
    "MTK",
    ethers.utils.parseUnits("1000000", 9), // 1M tokens
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
    "0x...", // Treasury address
    feeSettings,
    feeReceiverAddress,
    { value: ethers.utils.parseEther("0.2") } // Service fee
  );
  
  await token.deployed();
  console.log("Token deployed to:", token.address);
}
```

### Manage Token

```javascript
const { TokenManager } = require("./token-manager");

async function manageToken() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = "YOUR_TOKEN_ADDRESS";
  
  const manager = new TokenManager(tokenAddress, signer);
  await manager.initialize();
  
  // Get token info
  const info = await manager.getTokenInfo();
  console.log("Token Info:", info);
  
  // Get fee info
  const fees = await manager.getFeeInfo();
  console.log("Fee Info:", fees);
  
  // Update fees (owner only)
  await manager.setFees(2, 3, 1, 0.5); // 2% reflection, 3% liquidity, 1% treasury, 0.5% burn
  
  // Transfer tokens
  await manager.transfer("0x...", 1000);
}
```

### Manage FeeReceiver

```javascript
const { FeeReceiverManager } = require("./fee-receiver-manager");

async function manageFeeReceiver() {
  const [signer] = await ethers.getSigners();
  const feeReceiverAddress = "YOUR_FEE_RECEIVER_ADDRESS";
  
  const manager = new FeeReceiverManager(feeReceiverAddress, signer);
  await manager.initialize();
  
  // Get analytics
  const analytics = await manager.getAnalytics();
  console.log("Analytics:", analytics);
  
  // Get token list
  const tokens = await manager.getTokenList(10, 0);
  console.log("Recent tokens:", tokens);
  
  // Withdraw fees (owner only)
  await manager.withdrawFees();
}
```

## 🔍 Contract Functions

### RexasErc20 Token Functions

#### View Functions
- `name()` - Get token name
- `symbol()` - Get token symbol
- `decimals()` - Get token decimals (9)
- `totalSupply()` - Get total supply
- `balanceOf(address)` - Get balance of address
- `_reflectionFee()` - Get reflection fee in basis points
- `_liquidityFee()` - Get liquidity fee in basis points
- `_treasuryFee()` - Get treasury fee in basis points
- `_burnFee()` - Get burn fee in basis points

#### Owner Functions
- `setFeePercents(reflection, liquidity, treasury, burn)` - Set all fees
- `setTreasuryAddress(address)` - Set treasury address
- `setSwapAndLiquifyEnabled(bool)` - Enable/disable auto liquidity
- `excludeFromFee(address)` - Exclude address from fees
- `includeInFee(address)` - Include address in fees
- `excludeFromReward(address)` - Exclude from reflection rewards
- `includeInReward(address)` - Include in reflection rewards

#### User Functions
- `transfer(to, amount)` - Transfer tokens
- `transferFrom(from, to, amount)` - Transfer tokens with allowance
- `approve(spender, amount)` - Approve spender
- `allowance(owner, spender)` - Get allowance

### FeeReceiver Functions

#### View Functions
- `serviceFee()` - Get current service fee
- `getTokenList(size, cursor)` - Get paginated token list
- `getUserTokenList(user, size, cursor)` - Get user's tokens
- `getTokenListLength()` - Get total token count

#### Owner Functions
- `setFee(fee)` - Set service fee
- `withdrawFee()` - Withdraw collected fees
- `addToken(createdAt, addr, owner)` - Manually add token
- `toggleTokenStatus(id)` - Enable/disable token
- `withdrawUnrecoverableAsset(token)` - Recover stuck tokens

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/token.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

## 📊 Analytics

The system provides comprehensive analytics:

- **Token Analytics**: Supply, fees, balances, reflections
- **FeeReceiver Analytics**: Total tokens, fees collected, revenue
- **User Analytics**: Token ownership, transaction history
- **Network Analytics**: Gas usage, deployment costs

## 🔒 Security Considerations

### RexasErc20
- ✅ Reentrancy protection for liquidity operations
- ✅ Fee caps (max 25% total fees)
- ✅ Zero address checks
- ✅ SafeMath operations (redundant in Solidity ≥0.8.0)
- ⚠️ Owner privileges (centralization risk)
- ⚠️ No timelock for fee changes

### FeeReceiver
- ✅ Ownable access control
- ✅ Safe token transfers
- ✅ Emergency withdrawal functions
- ⚠️ Centralized fee management
- ⚠️ Gas inefficiency in large token lists

## 🌐 Network Support

- **Ethereum Mainnet**
- **Ethereum Testnet (Goerli)**
- **BSC Mainnet**
- **BSC Testnet**
- **Local Development (Hardhat)**

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic token and fee receiver contracts
- **v1.1.0**: Added comprehensive management interfaces
- **v1.2.0**: Enhanced analytics and deployment scripts