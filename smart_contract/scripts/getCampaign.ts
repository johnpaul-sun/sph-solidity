import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";

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
      console.log(result);
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
