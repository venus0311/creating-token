const { ethers } = require("hardhat");

class FeeReceiverManager {
  constructor(feeReceiverAddress, signer) {
    this.feeReceiver = null;
    this.signer = signer;
    this.feeReceiverAddress = feeReceiverAddress;
  }

  async initialize() {
    const FeeReceiver = await ethers.getContractFactory("FeeReceiver", this.signer);
    this.feeReceiver = FeeReceiver.attach(this.feeReceiverAddress);
    console.log("FeeReceiver manager initialized for:", this.feeReceiverAddress);
  }

  // Fee Information
  async getServiceFee() {
    const fee = await this.feeReceiver.serviceFee();
    return ethers.utils.formatEther(fee);
  }

  async setServiceFee(newFee) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const feeWei = ethers.utils.parseEther(newFee.toString());
    const tx = await this.feeReceiver.setFee(feeWei);
    await tx.wait();
    console.log("Service fee updated to:", newFee, "ETH");
  }

  // Token Management
  async getTokenList(size = 10, cursor = 0) {
    const tokens = await this.feeReceiver.getTokenList(size, cursor);
    return tokens.map(token => ({
      createdAt: new Date(token.createdAt.toNumber() * 1000),
      address: token.addr,
      creator: token.creator,
      enabled: token.enabled
    }));
  }

  async getTokenListLength() {
    return await this.feeReceiver.getTokenListLength();
  }

  async getUserTokenList(userAddress, size = 10, cursor = 0) {
    const tokens = await this.feeReceiver.getUserTokenList(userAddress, size, cursor);
    return tokens.map(token => ({
      createdAt: new Date(token.createdAt.toNumber() * 1000),
      address: token.addr,
      creator: token.creator,
      enabled: token.enabled
    }));
  }

  async getUserTokenListLength(userAddress) {
    return await this.feeReceiver.getUserTokenListLength(userAddress);
  }

  async addToken(createdAt, tokenAddress, owner) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.feeReceiver.addToken(createdAt, tokenAddress, owner);
    await tx.wait();
    console.log("Token added:", tokenAddress);
  }

  async toggleTokenStatus(tokenId) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.feeReceiver.toggleTokenStatus(tokenId);
    await tx.wait();
    console.log("Token status toggled for ID:", tokenId);
  }

  // Financial Management
  async getBalance() {
    const balance = await this.signer.provider.getBalance(this.feeReceiverAddress);
    return ethers.utils.formatEther(balance);
  }

  async withdrawFees() {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.feeReceiver.withdrawFee();
    await tx.wait();
    console.log("Fees withdrawn successfully");
  }

  async withdrawUnrecoverableAsset(tokenAddress) {
    if (!this.signer) throw new Error("Signer required for owner functions");
    
    const tx = await this.feeReceiver.withdrawUnrecoverableAsset(tokenAddress);
    await tx.wait();
    console.log("Unrecoverable asset withdrawn:", tokenAddress);
  }

  // Analytics
  async getAnalytics() {
    const [totalTokens, serviceFee, balance] = await Promise.all([
      this.getTokenListLength(),
      this.getServiceFee(),
      this.getBalance()
    ]);

    return {
      totalTokens: totalTokens.toNumber(),
      serviceFee: parseFloat(serviceFee),
      contractBalance: parseFloat(balance),
      totalValueCollected: parseFloat(balance) + parseFloat(serviceFee) * totalTokens.toNumber()
    };
  }

  // Token Verification
  async verifyToken(tokenAddress) {
    const totalTokens = await this.getTokenListLength();
    
    for (let i = 0; i < totalTokens; i++) {
      const tokens = await this.getTokenList(1, i);
      if (tokens[0] && tokens[0].address.toLowerCase() === tokenAddress.toLowerCase()) {
        return {
          found: true,
          tokenInfo: tokens[0]
        };
      }
    }
    
    return { found: false };
  }
}

// Example usage
async function main() {
  const [signer] = await ethers.getSigners();
  const feeReceiverAddress = "YOUR_FEE_RECEIVER_ADDRESS"; // Replace with actual address
  
  const manager = new FeeReceiverManager(feeReceiverAddress, signer);
  await manager.initialize();
  
  // Get analytics
  const analytics = await manager.getAnalytics();
  console.log("Analytics:", analytics);
  
  // Get recent tokens
  const recentTokens = await manager.getTokenList(5, 0);
  console.log("Recent tokens:", recentTokens);
  
  // Get user tokens
  const userTokens = await manager.getUserTokenList(signer.address, 10, 0);
  console.log("User tokens:", userTokens);
  
  // Example: Update service fee (only owner can do this)
  // await manager.setServiceFee(0.3); // Set to 0.3 ETH
  
  // Example: Withdraw fees (only owner can do this)
  // await manager.withdrawFees();
}

module.exports = { FeeReceiverManager };

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 