import { crowdFundingContract } from "./createContract";

async function createCampaign() {
  console.log("CREATING...");
  await crowdFundingContract
    .createCampaign(
      process.argv[2], // name
      process.argv[3], // title
      process.argv[4], // story
      process.argv[5], // goal
      process.argv[6], // deadline
    )
    .then(() => {
      console.log("SUCCESS!... Mining in progress..");
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}
createCampaign();
