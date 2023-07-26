import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import { utils } from "ethers";

type SearchResult = [
  CrowdFunding.CampaignStructOutput[],
  CrowdFunding.ResultIndexDataStructOutput,
] & {
  matchingCampaigns: CrowdFunding.CampaignStructOutput[];
  searchIndexData: CrowdFunding.ResultIndexDataStructOutput;
};

async function main() {
  if (
    process.argv[2] !== undefined && // search string
    process.argv[3] !== undefined && // page size
    process.argv[4] !== undefined // start index
  ) {
    await searchByTitle(
      process.argv[2], // search string
      process.argv[3], // page size
      process.argv[4], // start index
    );
  }
}

export default async function searchByTitle(
  searchString: string,
  pageSize: string,
  startIndex: string,
) {
  console.log("FETCHING...\n");
  await crowdFundingContract
    .searchByTitle(searchString, pageSize, startIndex)
    .then((result: SearchResult) => {
      result.matchingCampaigns.forEach((campaign) => {
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
      console.log("LAST PAGE: ", result.searchIndexData.isLastPage);
      console.log("NEXT INDEX: ", result.searchIndexData.nextIndex.toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
