import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import type { BigNumber } from "ethers";
import { utils } from "ethers";

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
      result[0].forEach((donation) => {
        console.log("----------------------------------------------------");
        console.log("ID: ", donation.id.toNumber());
        console.log("DONOR: ", donation.donor);
        console.log("AMOUNT: ", utils.formatEther(donation.amount));
      });
      console.log("******************************************************");
      console.log("TOTAL DONATIONS: ", result[1].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
