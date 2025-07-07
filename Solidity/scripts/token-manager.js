const { ethers } = require("hardhat");

class TokenManager {
  constructor(tokenAddress, signer) {
    this.token = null;
    this.signer = signer;
    this.tokenAddress = tokenAddress;
  }

  async initialize() {
    const RexasErc20 = await ethers.getContractFactory("RexasErc20", this.signer);
    this.token = RexasErc20.attach(this.tokenAddress);
    console.log("Token manager initialized for:", this.tokenAddress);
  }

  // Token Information
  async getTokenInfo() {
    const [name, symbol, totalSupply, decimals, owner] = await Promise.all([
      this.token.name(),
      this.token.symbol(),
      this.token.totalSupply(),
      this.token.decimals(),
      this.token.owner()
    ]);

    return {
      name,
      symbol,
      totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
      decimals,
      owner,
      address: this.tokenAddress
    };
  }

  // Fee Information
  async getFeeInfo() {
    const [
      reflectionFee,
      liquidityFee,
      treasuryFee,
      burnFee,
      applyReflectionFeeToAll,
      applyLiquidityFeeToAll,
      applyTreasuryFeeToAll,
      applyBurnFeeToAll
    ] = await Promise.all([
      this.token._reflectionFee(),
      this.token._liquidityFee(),
      this.token._treasuryFee(),
      this.token._burnFee(),
      this.token._applyReflectionFeeToAll(),
      this.token._applyLiquidityFeeToAll(),
      this.token._applyTreasuryFeeToAll(),
      this.token._applyBurnFeeToAll()
    ]);

    return {
      reflectionFee: reflectionFee.toNumber() / 100, // Convert from basis points to percentage
      liquidityFee: liquidityFee.toNumber() / 100,
      treasuryFee: treasuryFee.toNumber() / 100,
      burnFee: burnFee.toNumber() / 100,
      applyReflectionFeeToAll,
      applyLiquidityFeeToAll,
      applyTreasuryFeeToAll,
      applyBurnFeeToAll
    };
  }

  // Balance and Reflection
  async getBalance(address) {
    const balance = await this.token.balanceOf(address);
    const reflection = await this.token.reflectionFromToken(balance, false);
    return {
      balance: ethers.utils.formatUnits(balance, 9),
      reflection: reflection.toString()
    };
  }

  // Owner Functions
  async setFees(reflectionFee, liquidityFee, treasuryFee, burnFee) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.setFeePercents(
      reflectionFee * 100, // Convert to basis points
      liquidityFee * 100,
      treasuryFee * 100,
      burnFee * 100
    );
    
    await tx.wait();
    console.log("Fees updated successfully");
  }

  async setTreasuryAddress(treasuryAddress) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.setTreasuryAddress(treasuryAddress);
    await tx.wait();
    console.log("Treasury address updated to:", treasuryAddress);
  }

  async toggleSwapAndLiquify(enabled) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.setSwapAndLiquifyEnabled(enabled);
    await tx.wait();
    console.log("Swap and liquify", enabled ? "enabled" : "disabled");
  }

  async excludeFromFee(address) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.excludeFromFee(address);
    await tx.wait();
    console.log("Address excluded from fees:", address);
  }

  async includeInFee(address) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.includeInFee(address);
    await tx.wait();
    console.log("Address included in fees:", address);
  }

  // Transfer Functions
  async transfer(to, amount) {
    const amountWei = ethers.utils.parseUnits(amount.toString(), 9);
    const tx = await this.token.transfer(to, amountWei);
    await tx.wait();
    console.log(`Transferred ${amount} tokens to ${to}`);
  }

  async transferFrom(from, to, amount) {
    const amountWei = ethers.utils.parseUnits(amount.toString(), 9);
    const tx = await this.token.transferFrom(from, to, amountWei);
    await tx.wait();
    console.log(`Transferred ${amount} tokens from ${from} to ${to}`);
  }

  // Liquidity Functions
  async swapAndLiquify() {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.token.swapAndLiquify();
    await tx.wait();
    console.log("Swap and liquify executed");
  }

  // Utility Functions
  async isExcludedFromFee(address) {
    return await this.token.isExcludedFromFee(address);
  }

  async isExcludedFromReward(address) {
    return await this.token.isExcludedFromReward(address);
  }

  async getTotalFees() {
    const fees = await this.token.totalFees();
    return ethers.utils.formatUnits(fees, 9);
  }
}

// Example usage
async function main() {
  const [signer] = await ethers.getSigners();
  const tokenAddress = "YOUR_TOKEN_ADDRESS"; // Replace with actual token address
  
  const manager = new TokenManager(tokenAddress, signer);
  await manager.initialize();
  
  // Get token information
  const tokenInfo = await manager.getTokenInfo();
  console.log("Token Info:", tokenInfo);
  
  // Get fee information
  const feeInfo = await manager.getFeeInfo();
  console.log("Fee Info:", feeInfo);
  
  // Get balance
  const balance = await manager.getBalance(signer.address);
  console.log("Balance:", balance);
  
  // Example: Update fees (only owner can do this)
  // await manager.setFees(2, 3, 1, 0.5); // 2% reflection, 3% liquidity, 1% treasury, 0.5% burn
}

module.exports = { TokenManager };

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 