import { crowdFundingContract } from "./createContract";

async function getUserCampaigns() {
  console.log("FETCHING...");
  await crowdFundingContract
    .getUserCampaigns()
    .then((result: any) => {
      console.log(result);
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}
getUserCampaigns();
