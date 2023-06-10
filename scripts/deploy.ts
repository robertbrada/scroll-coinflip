import { ethers } from "hardhat";

console.log("process.env.PRIVATE_KEY", process.env.PRIVATE_KEY);


async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.001");

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
