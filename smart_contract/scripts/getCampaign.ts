import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";

async function getCampaign() {
  console.log("FETCHING...");
  await crowdFundingContract
    .getCampaign(
      process.argv[2] // campaign id
    )
    .then((result: CrowdFunding.CampaignStructOutput) => {
      console.log(result);
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}
getCampaign();
