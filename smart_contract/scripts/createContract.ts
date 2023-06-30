const { ethers } = require("hardhat");
import contract from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

const API_URL = process.env.API_URL;
const USER_KEY = process.env.USER_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

console.log("CONTRACT ADDRESS: ", CONTRACT_ADDRESS);

const httpProvider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(USER_KEY as string, httpProvider);

// // Contract
export const crowdFundingContract = new ethers.Contract(
  CONTRACT_ADDRESS as string,
  contract.abi,
  signer,
);

export default crowdFundingContract;
