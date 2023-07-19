import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import type { BigNumber } from "ethers";

export type RecentCampaignsResult = [
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
      console.log(result[0]);
      console.log("Fetched Campaigns: ", result[1].toNumber());
      console.log("Total Campaigns: ", result[2].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
