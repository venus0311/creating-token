const { ethers } = require("hardhat");
const { TokenManager } = require("./token-manager");
const { FeeReceiverManager } = require("./fee-receiver-manager");

class CompleteSetup {
  constructor() {
    this.feeReceiverAddress = null;
    this.feeReceiverManager = null;
    this.deployedTokens = [];
  }

  // Step 1: Deploy FeeReceiver
  async deployFeeReceiver() {
    console.log("🚀 Deploying FeeReceiver contract...");
    
    const FeeReceiver = await ethers.getContractFactory("FeeReceiver");
    const feeReceiver = await FeeReceiver.deploy();
    await feeReceiver.deployed();
    
    this.feeReceiverAddress = feeReceiver.address;
    console.log("✅ FeeReceiver deployed to:", this.feeReceiverAddress);
    
    // Initialize manager
    const [signer] = await ethers.getSigners();
    this.feeReceiverManager = new FeeReceiverManager(this.feeReceiverAddress, signer);
    await this.feeReceiverManager.initialize();
    
    return this.feeReceiverAddress;
  }

  // Step 2: Deploy Token with Custom Configuration
  async deployToken(config) {
    if (!this.feeReceiverAddress) {
      throw new Error("FeeReceiver must be deployed first");
    }

    console.log(`🚀 Deploying ${config.name} (${config.symbol}) token...`);
    
    const RexasErc20 = await ethers.getContractFactory("RexasErc20");
    
    // Fee settings
    const feeSettings = {
      reflectionFeeBps: config.reflectionFee * 100,
      applyReflectionFeeToAll: config.applyReflectionFeeToAll || false,
      liquidityFeeBps: config.liquidityFee * 100,
      applyLiquidityFeeToAll: config.applyLiquidityFeeToAll || false,
      treasuryFeeBps: config.treasuryFee * 100,
      applyTreasuryFeeToAll: config.applyTreasuryFeeToAll || false,
      burnFeeBps: config.burnFee * 100,
      applyBurnFeeToAll: config.applyBurnFeeToAll || false
    };
    
    const totalSupplyWithDecimals = ethers.utils.parseUnits(config.totalSupply.toString(), 9);
    const serviceFee = ethers.utils.parseEther(config.serviceFee.toString());
    
    const token = await RexasErc20.deploy(
      config.name,
      config.symbol,
      totalSupplyWithDecimals,
      config.routerAddress,
      config.treasuryAddress,
      feeSettings,
      this.feeReceiverAddress,
      { value: serviceFee }
    );
    
    await token.deployed();
    
    console.log("✅ Token deployed to:", token.address);
    
    // Store token info
    this.deployedTokens.push({
      address: token.address,
      name: config.name,
      symbol: config.symbol,
      config: config
    });
    
    return token.address;
  }

  // Step 3: Deploy Multiple Tokens with Presets
  async deployTokenPresets() {
    const presets = [
      {
        name: "Reflection Token",
        symbol: "RFLX",
        totalSupply: 1000000,
        reflectionFee: 2,
        liquidityFee: 3,
        treasuryFee: 1,
        burnFee: 0.5,
        applyReflectionFeeToAll: false,
        applyLiquidityFeeToAll: false,
        applyTreasuryFeeToAll: false,
        applyBurnFeeToAll: false,
        serviceFee: 0.2
      },
      {
        name: "High Burn Token",
        symbol: "BURN",
        totalSupply: 500000,
        reflectionFee: 1,
        liquidityFee: 2,
        treasuryFee: 0.5,
        burnFee: 3,
        applyReflectionFeeToAll: true,
        applyLiquidityFeeToAll: true,
        applyTreasuryFeeToAll: true,
        applyBurnFeeToAll: true,
        serviceFee: 0.2
      },
      {
        name: "Liquidity Token",
        symbol: "LIQ",
        totalSupply: 2000000,
        reflectionFee: 0.5,
        liquidityFee: 5,
        treasuryFee: 0.5,
        burnFee: 0,
        applyReflectionFeeToAll: false,
        applyLiquidityFeeToAll: false,
        applyTreasuryFeeToAll: false,
        applyBurnFeeToAll: false,
        serviceFee: 0.2
      }
    ];

    const [signer] = await ethers.getSigners();
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router
    
    for (const preset of presets) {
      const config = {
        ...preset,
        routerAddress,
        treasuryAddress: signer.address
      };
      
      await this.deployToken(config);
    }
  }

  // Step 4: Get Complete Analytics
  async getCompleteAnalytics() {
    if (!this.feeReceiverManager) {
      throw new Error("FeeReceiver manager not initialized");
    }

    console.log("📊 Generating complete analytics...");
    
    const feeReceiverAnalytics = await this.feeReceiverManager.getAnalytics();
    
    const tokenAnalytics = [];
    for (const tokenInfo of this.deployedTokens) {
      const tokenManager = new TokenManager(tokenInfo.address);
      await tokenManager.initialize();
      
      const [tokenData, feeData, balance] = await Promise.all([
        tokenManager.getTokenInfo(),
        tokenManager.getFeeInfo(),
        tokenManager.getBalance(tokenData.owner)
      ]);
      
      tokenAnalytics.push({
        address: tokenInfo.address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        totalSupply: tokenData.totalSupply,
        owner: tokenData.owner,
        fees: feeData,
        ownerBalance: balance
      });
    }
    
    return {
      feeReceiver: feeReceiverAnalytics,
      tokens: tokenAnalytics,
      summary: {
        totalTokensDeployed: this.deployedTokens.length,
        totalValueCollected: feeReceiverAnalytics.totalValueCollected,
        averageFees: {
          reflection: tokenAnalytics.reduce((sum, t) => sum + t.fees.reflectionFee, 0) / tokenAnalytics.length,
          liquidity: tokenAnalytics.reduce((sum, t) => sum + t.fees.liquidityFee, 0) / tokenAnalytics.length,
          treasury: tokenAnalytics.reduce((sum, t) => sum + t.fees.treasuryFee, 0) / tokenAnalytics.length,
          burn: tokenAnalytics.reduce((sum, t) => sum + t.fees.burnFee, 0) / tokenAnalytics.length
        }
      }
    };
  }

  // Step 5: Management Functions
  async manageToken(tokenAddress, action, params = {}) {
    const tokenManager = new TokenManager(tokenAddress);
    await tokenManager.initialize();
    
    switch (action) {
      case 'getInfo':
        return await tokenManager.getTokenInfo();
      
      case 'getFees':
        return await tokenManager.getFeeInfo();
      
      case 'setFees':
        return await tokenManager.setFees(
          params.reflectionFee,
          params.liquidityFee,
          params.treasuryFee,
          params.burnFee
        );
      
      case 'transfer':
        return await tokenManager.transfer(params.to, params.amount);
      
      case 'excludeFromFee':
        return await tokenManager.excludeFromFee(params.address);
      
      case 'includeInFee':
        return await tokenManager.includeInFee(params.address);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async manageFeeReceiver(action, params = {}) {
    if (!this.feeReceiverManager) {
      throw new Error("FeeReceiver manager not initialized");
    }
    
    switch (action) {
      case 'getAnalytics':
        return await this.feeReceiverManager.getAnalytics();
      
      case 'setServiceFee':
        return await this.feeReceiverManager.setServiceFee(params.fee);
      
      case 'withdrawFees':
        return await this.feeReceiverManager.withdrawFees();
      
      case 'getTokenList':
        return await this.feeReceiverManager.getTokenList(params.size, params.cursor);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}

// Example usage
async function main() {
  const setup = new CompleteSetup();
  
  try {
    // Step 1: Deploy FeeReceiver
    await setup.deployFeeReceiver();
    
    // Step 2: Deploy token presets
    await setup.deployTokenPresets();
    
    // Step 3: Get analytics
    const analytics = await setup.getCompleteAnalytics();
    console.log("📈 Complete Analytics:", JSON.stringify(analytics, null, 2));
    
    // Step 4: Example management operations
    if (setup.deployedTokens.length > 0) {
      const firstToken = setup.deployedTokens[0];
      
      // Get token info
      const tokenInfo = await setup.manageToken(firstToken.address, 'getInfo');
      console.log("Token Info:", tokenInfo);
      
      // Get fee info
      const feeInfo = await setup.manageToken(firstToken.address, 'getFees');
      console.log("Fee Info:", feeInfo);
    }
    
    // Get FeeReceiver analytics
    const feeReceiverAnalytics = await setup.manageFeeReceiver('getAnalytics');
    console.log("FeeReceiver Analytics:", feeReceiverAnalytics);
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

module.exports = { CompleteSetup };

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 