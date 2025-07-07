const { ethers } = require("hardhat");

async function deployToken(
  name,
  symbol,
  totalSupply,
  routerAddress,
  treasuryAddress,
  feeReceiverAddress,
  serviceFee
) {
  console.log(`Deploying ${name} (${symbol}) token...`);
  
  const RexasErc20 = await ethers.getContractFactory("RexasErc20");
  
  // Fee settings structure
  const feeSettings = {
    reflectionFeeBps: 200,      // 2% reflection fee
    applyReflectionFeeToAll: false, // Only on DEX trades
    liquidityFeeBps: 300,       // 3% liquidity fee
    applyLiquidityFeeToAll: false,  // Only on DEX trades
    treasuryFeeBps: 100,        // 1% treasury fee
    applyTreasuryFeeToAll: false,   // Only on DEX trades
    burnFeeBps: 50,             // 0.5% burn fee
    applyBurnFeeToAll: false    // Only on DEX trades
  };
  
  // Calculate total supply with decimals (9 decimals)
  const totalSupplyWithDecimals = ethers.utils.parseUnits(totalSupply.toString(), 9);
  
  // Deploy with service fee
  const token = await RexasErc20.deploy(
    name,
    symbol,
    totalSupplyWithDecimals,
    routerAddress,
    treasuryAddress,
    feeSettings,
    feeReceiverAddress,
    { value: serviceFee }
  );
  
  await token.deployed();
  
  console.log("Token deployed to:", token.address);
  console.log("Total supply:", ethers.utils.formatUnits(await token.totalSupply(), 9));
  console.log("Owner:", await token.owner());
  
  return token.address;
}

// Example usage
async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Configuration
  const config = {
    name: "My Token",
    symbol: "MTK",
    totalSupply: 1000000, // 1 million tokens
    routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
    treasuryAddress: deployer.address, // Use deployer as treasury
    feeReceiverAddress: "YOUR_FEE_RECEIVER_ADDRESS", // Replace with actual address
    serviceFee: ethers.utils.parseEther("0.2") // 0.2 ETH
  };
  
  const tokenAddress = await deployToken(
    config.name,
    config.symbol,
    config.totalSupply,
    config.routerAddress,
    config.treasuryAddress,
    config.feeReceiverAddress,
    config.serviceFee
  );
  
  console.log("Deployment completed!");
  console.log("Token address:", tokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 