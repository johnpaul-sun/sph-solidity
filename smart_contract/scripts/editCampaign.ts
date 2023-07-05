import { ContractTransaction } from "ethers";
import { crowdFundingContract } from "./createContract";

async function editCampaign() {
  console.log("EDITING...");
  await crowdFundingContract
    .editCampaign(
      Number(process.argv[2]), // id
      process.argv[3], // name
      process.argv[4], // title
      process.argv[5], // story
      process.argv[6], // goal
      process.argv[7], // deadline
    )
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
editCampaign();
