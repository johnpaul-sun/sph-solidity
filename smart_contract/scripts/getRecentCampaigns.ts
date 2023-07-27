import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import type { BigNumber } from "ethers";
import { utils } from "ethers";

type RecentCampaignsResult = [
  CrowdFunding.CampaignStructOutput[],
  BigNumber,
  BigNumber,
];

async function main() {
  if (
    process.argv[2] !== undefined // size
  ) {
    await getRecentCampaigns(process.argv[2]);
  }
}

export default async function getRecentCampaigns(size: string) {
  console.log("FETCHING...");
  await crowdFundingContract
    .getRecentCampaigns(size)
    .then((result: RecentCampaignsResult) => {
      result[0].forEach((campaign) => {
        console.log("----------------------------------------------------");
        console.log("ID: ", campaign.id.toNumber());
        console.log("TITLE: ", campaign.title);
        console.log("FULL NAME: ", campaign.fullname);
        console.log("CREATOR ADDRESS: ", campaign.creator);
        console.log("STORY: ", campaign.story);
        console.log("GOAL AMOUNT: ", utils.formatEther(campaign.goalAmount), " ETH");
        console.log("CURRENT AMOUNT: ", utils.formatEther(campaign.currentAmount), " ETH");
        console.log("DEADLINE: ", campaign.deadline.toString());
      });

      console.log("******************************************************");
      console.log("Fetched Campaigns: ", result[1].toNumber());
      console.log("Total Campaigns: ", result[2].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
