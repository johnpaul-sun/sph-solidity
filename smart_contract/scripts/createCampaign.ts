import { ContractTransaction } from "ethers";
import { crowdFundingContract } from "./createContract";

async function main() {
  if (
    process.argv[2] !== undefined && // name
    process.argv[3] !== undefined && // title
    process.argv[4] !== undefined && // story
    process.argv[5] !== undefined && // image_url
    process.argv[6] !== undefined && // goal
    process.argv[7] !== undefined // deadline
  ) {
    await createCampaign(
      process.argv[2], // name
      process.argv[3], // title
      process.argv[4], // story
      process.argv[5], // image_url
      process.argv[6], // goal
      process.argv[7], // deadline
    );
  }
}

export default async function createCampaign(
  name: string,
  title: string,
  story: string,
  imageUrl: string,
  goal: string,
  deadline: string,
) {
  console.log("CREATING...");
  await crowdFundingContract
    .createCampaign(name, title, story, imageUrl, goal, deadline)
    .then((result: ContractTransaction) => {
      console.log("SUCCESS!... Mining in progress..");
      console.log(result);
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
