import { crowdFundingContract } from "./createContract";

type DonatorsResult = [string[], string[], string[]];

interface DonatorData {
  donator: string;
  campaignTitle: string;
  donationAmount: string;
}

async function getDonatorsByWalletAddress() {
  console.log("FETCHING DONATORS...");
  try {
    const donators: any[] =
      await crowdFundingContract.getDonatorsByWalletAddress(process.argv[2]); // Wallet address
    const donatorsData = donators.map((donator: any) => ({
      donator: donator[0],
      campaignTitle: donator[1],
      donationAmount: donator[2].toString(),
    }));
    console.log(JSON.stringify(donatorsData, null, 2));
  } catch (error) {
    console.log("ERROR!", error);
  }
}

getDonatorsByWalletAddress();
