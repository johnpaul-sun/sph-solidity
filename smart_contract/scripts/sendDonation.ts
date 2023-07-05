import { ContractTransaction, utils } from "ethers";
import { crowdFundingContract, signer } from "./createContract";

async function sendDonation() {
  const campaignId = Number(process.argv[2]);
  const donationWeiAmount = utils.parseEther(process.argv[3]);
  console.log("USER ADDRESS: ", await signer.getAddress());
  console.log(
    "INITIAL BALANCE: ",
    await signer.getBalance().then((result) => result.toString()),
  );
  console.log(`Sending ${donationWeiAmount} WEI...`);
  await crowdFundingContract
    .sendDonation(campaignId, { value: donationWeiAmount })
    .then(async (result: ContractTransaction) => {
      console.log("SUCCESS!... Mining in progress..");
      console.log(await result.wait());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

crowdFundingContract?.on(
  "DonationSent",
  async (sender: string, title: string, amount: number) => {
    const userAddress = await signer.getAddress();
    if (sender.toLowerCase() === userAddress.toLocaleLowerCase()) {
      console.log("DONATION SUCCESS!");
      console.log("CAMPAIGN TITLE: ", title);
      console.log("RAISED ETH: ", utils.formatEther(amount));
      console.log(
        "REMAINING BALANCE: ",
        await signer.getBalance().then((result) => result.toString()),
      );
    }
  },
);

sendDonation();
