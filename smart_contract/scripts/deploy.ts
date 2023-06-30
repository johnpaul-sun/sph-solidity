import { ethers } from "hardhat";

async function main() {
  const CrowdFundingContract = await ethers.getContractFactory("CrowdFunding");

  // Start deployment, returning a promise that resolves to a contract object
  const crowdFunding = await CrowdFundingContract.deploy();

  console.log("Contract deployed to address:", crowdFunding.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
