const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FeeReceiver contract...");
  
  const FeeReceiver = await ethers.getContractFactory("FeeReceiver");
  const feeReceiver = await FeeReceiver.deploy();
  
  await feeReceiver.deployed();
  
  console.log("FeeReceiver deployed to:", feeReceiver.address);
  console.log("Default service fee:", ethers.utils.formatEther(await feeReceiver.serviceFee()), "ETH");
  
  return feeReceiver.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 