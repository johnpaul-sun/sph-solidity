import { ethers } from "hardhat";
import contract from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

const API_URL = process.env.API_URL;
const USER_KEY = process.env.USER_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

console.log("CONTRACT ADDRESS: ", CONTRACT_ADDRESS);

const httpProvider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(USER_KEY as string, httpProvider);

// Contract
const crowdFundingContract = new ethers.Contract(
  CONTRACT_ADDRESS as string,
  contract.abi,
  signer,
);

async function main() {
  await crowdFundingContract.createCampaign(
    "arden",
    "sample title",
    "sample story",
    100,
    1687392000000,
  );

  const totalCampaigns = await crowdFundingContract.totalCampaigns();
  const newCampaign = await crowdFundingContract.campaigns(totalCampaigns - 1);
  console.log("Id: " + newCampaign[0]);
  console.log("Creator: " + newCampaign[1]);
  console.log("Full Name: " + newCampaign[2]);
  console.log("Title: " + newCampaign[3]);
  console.log("Story: " + newCampaign[4]);
  console.log("Goal Amount: " + newCampaign[5]);
  console.log("Current Amount: " + newCampaign[6]);
  console.log("Deadline: " + new Date(newCampaign[7]));
}
main();
