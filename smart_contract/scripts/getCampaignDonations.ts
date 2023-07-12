import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import type { BigNumber } from "ethers";

type CampaignDonationsResult = [
  CrowdFunding.DonationTransactionStructOutput[],
  BigNumber,
];

async function main() {
  if (
    process.argv[2] !== undefined // campaign id
  ) {
    await getCampaignDonations(process.argv[2]);
  }
}

export default async function getCampaignDonations(id: string) {
  console.log("FETCHING...");
  await crowdFundingContract
    .getCampaignDonations(id)
    .then((result: CampaignDonationsResult) => {
      console.log(result[0]);
      console.log("Campaign total donations: ", result[1].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
