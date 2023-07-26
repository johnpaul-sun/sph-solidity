import { ContractTransaction } from "ethers";
import { crowdFundingContract } from "./createContract";
import type { BigNumber } from "ethers";
import { utils } from "ethers";

async function main() {
  if (
    process.argv[2] !== undefined && // id
    process.argv[3] !== undefined && // name
    process.argv[4] !== undefined && // title
    process.argv[5] !== undefined && // story
    process.argv[6] !== undefined && // image url
    process.argv[7] !== undefined && // goal
    process.argv[8] !== undefined // deadline
  ) {
    await editCampaign(
      process.argv[2], // id
      process.argv[3], // name
      process.argv[4], // title
      process.argv[5], // story
      process.argv[6], // image url
      utils.parseEther(process.argv[6]), // goal
      process.argv[8], // deadline
    );
  }
}

export default async function editCampaign(
  id: string,
  name: string,
  title: string,
  story: string,
  imageUrl: string,
  goal: BigNumber,
  deadline: string,
) {
  console.log("EDITING...");
  await crowdFundingContract
    .editCampaign(id, name, title, story, imageUrl, goal, deadline)
    .then((result: ContractTransaction) => {
      console.log("SUCCESS!... Mining in progress..");
      console.log(result);
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });

  crowdFundingContract?.on(
    "CampaignEdited",
    (sender: string, title: string) => {
      console.log(sender, title);
    },
  );
}

main();
