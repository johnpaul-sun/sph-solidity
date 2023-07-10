import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import type { BigNumber } from "ethers";

type CampaignDonationsResult = [
  CrowdFunding.DonationTransactionStructOutput[],
  BigNumber,
];

async function getCampaignDonations() {
  console.log("FETCHING...");
  await crowdFundingContract
    .getCampaignDonations(
      process.argv[2] // campaign id
    )
    .then((result: CampaignDonationsResult) => {
      console.log(result[0]);
      console.log("Campaign total donations: ", result[1].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}
getCampaignDonations();
