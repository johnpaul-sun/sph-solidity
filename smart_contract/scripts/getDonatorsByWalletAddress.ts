import { crowdFundingContract } from "./createContract";
import { BigNumber } from "ethers";

type DonatorsResult = [Donator[], BigNumber, BigNumber, BigNumber, BigNumber];
type Donator = [string, string, BigNumber];

async function getDonatorsByWalletAddress() {
  const walletAddress = process.argv[2];
  const pageSize = parseInt(process.argv[3]);
  const pageNumber = parseInt(process.argv[4]);

  console.log("FETCHING DONATORS...");
  try {
    const donators: DonatorsResult =
      await crowdFundingContract.getDonatorsByWalletAddress(
        walletAddress,
        pageSize,
        pageNumber,
      );

    const donatorsData = donators[0]?.map((donator: Donator) => ({
      donator: donator[0],
      campaignTitle: donator[1],
      donationAmount: donator[2].toString(),
    }));

    console.log(JSON.stringify(donatorsData, null, 2));
    console.log("User total donators: ", donators[1].toNumber());
    console.log("Total Pages: ", donators[2].toNumber());
    console.log("Next Page: ", donators[3].toNumber());
    console.log("Previous Page: ", donators[4].toNumber());
  } catch (error) {
    console.log("ERROR!", error);
  }
}

getDonatorsByWalletAddress();
