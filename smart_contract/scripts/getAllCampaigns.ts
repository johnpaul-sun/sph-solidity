import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import { utils } from "ethers";

type AllCampaignsResult = [
  CrowdFunding.CampaignStructOutput[],
  CrowdFunding.ResultIndexDataStructOutput,
] & {
  allCampaigns: CrowdFunding.CampaignStructOutput[];
  indexData: CrowdFunding.ResultIndexDataStructOutput;
};

async function main() {
  if (
    process.argv[2] !== undefined && // size
    process.argv[3] !== undefined // start index
  ) {
    await getAllCampaigns(process.argv[2], process.argv[3]);
  }
}

export default async function getAllCampaigns(size: string, index: string) {
  console.log("FETCHING...");
  await crowdFundingContract
    .getAllCampaigns(size, index)
    .then((result: AllCampaignsResult) => {
      result.allCampaigns.forEach((campaign) => {
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
      console.log("LAST PAGE: ", result.indexData.isLastPage);
      console.log("NEXT INDEX: ", result.indexData.nextIndex.toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
