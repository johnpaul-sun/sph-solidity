import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import { utils } from "ethers";
import getCampaignDonations from './getCampaignDonations';

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
      console.log("CREATOR ADDRESS: ", result.creator);
      console.log("FULL NAME: ", result.fullname);
      console.log("TITLE: ", result.title);
      console.log("STORY: ", result.story);
      console.log("GOAL AMOUNT: ", utils.formatEther(result.goalAmount));
      console.log("CURRENT AMOUNT: ", utils.formatEther(result.currentAmount));
      console.log("DEADLINE: ", result.deadline.toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
  await getCampaignDonations(id);
}

main();
