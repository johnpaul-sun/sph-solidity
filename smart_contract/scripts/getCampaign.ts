import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import { utils } from "ethers";

async function main() {
  if (
    process.argv[2] !== undefined // campaign id
  ) {
    await getCampaign(process.argv[2]);
  }
}

export default async function getCampaign(id: string) {
  console.log("FETCHING...");
  await crowdFundingContract
    .getCampaign(id)
    .then((result: CrowdFunding.CampaignStructOutput) => {
      console.log("ID: ", result.id.toNumber());
      console.log("TITLE: ", result.title);
      console.log("FULL NAME: ", result.fullname);
      console.log("CREATOR ADDRESS: ", result.creator);
      console.log("STORY: ", result.story);
      console.log("GOAL AMOUNT: ", utils.formatEther(result.goalAmount), " ETH");
      console.log("CURRENT AMOUNT: ", utils.formatEther(result.currentAmount), " ETH");
      console.log("DEADLINE: ", result.deadline.toString());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
