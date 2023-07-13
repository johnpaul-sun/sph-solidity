import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";
import { utils } from "ethers";

type CampaignResult = [
  CrowdFunding.CampaignStructOutput,
  CrowdFunding.DonationTransactionStructOutput[],
];

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
    .then((result: CampaignResult) => {
      console.log("ID: ", result[0].id.toNumber());
      console.log("CREATOR ADDRESS: ", result[0].creator);
      console.log("FULL NAME: ", result[0].fullname);
      console.log("TITLE: ", result[0].title);
      console.log("STORY: ", result[0].story);
      console.log("GOAL AMOUNT: ", utils.formatEther(result[0].goalAmount));
      console.log("CURRENT AMOUNT: ", utils.formatEther(result[0].currentAmount));
      console.log("DEADLINE: ", result[0].deadline.toNumber());
      console.log("TOTAL DONATIONS: ", result[0].totalDonations.toNumber());
      result[1].forEach((donation) => {
        console.log("----------------------------------");
        console.log("ID: ", donation.id.toNumber());
        console.log("DONOR: ", donation.donor);
        console.log("AMOUNT: ", utils.formatEther(donation.amount));
      });
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
