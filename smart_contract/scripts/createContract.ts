const { ethers } = require("hardhat");
import { Signer, providers, Contract } from "ethers";
import contract from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

const API_URL = process.env.API_URL;
const USER_KEY = process.env.USER_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

console.log("CONTRACT ADDRESS: ", CONTRACT_ADDRESS);

const httpProvider: providers.JsonRpcProvider =
  new ethers.providers.JsonRpcProvider(API_URL);
export const signer: Signer = new ethers.Wallet(
  USER_KEY as string,
  httpProvider,
);

// Contract
export const crowdFundingContract: Contract = new ethers.Contract(
  CONTRACT_ADDRESS as string,
  contract.abi,
  signer,
);

export default crowdFundingContract;
