import { ethers } from "hardhat";

async function main() {

  // deploy coinFLip contract
  const coinFlip = await ethers.deployContract("CoinFlip", []);
  await coinFlip.waitForDeployment();

  console.log(`Coin Flip with deployed to ${coinFlip.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
