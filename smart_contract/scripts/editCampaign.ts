import { ContractTransaction } from "ethers";
import { crowdFundingContract } from "./createContract";

async function main() {
  if (
    process.argv[2] !== undefined && // id
    process.argv[3] !== undefined && // name
    process.argv[4] !== undefined && // title
    process.argv[5] !== undefined && // story
    process.argv[6] !== undefined && // goal
    process.argv[7] !== undefined // deadline
  ) {
    await editCampaign(
      process.argv[2], // id
      process.argv[3], // name
      process.argv[4], // title
      process.argv[5], // story
      process.argv[6], // goal
      process.argv[7], // deadline
    );
  }
}

export default async function editCampaign(
  id: string,
  name: string,
  title: string,
  story: string,
  goal: string,
  deadline: string,
) {
  console.log("EDITING...");
  await crowdFundingContract
    .editCampaign(id, name, title, story, goal, deadline)
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
