import { crowdFundingContract } from "./createContract";
import { BigNumber } from "ethers";

type DonatorsResult = [Donator[], BigNumber, BigNumber, BigNumber, BigNumber];
type Donator = [string, string, BigNumber];

async function main() {
  if (
    process.argv[2] !== undefined && // wallet address
    process.argv[3] !== undefined && // page size
    process.argv[4] !== undefined // page number
  ) {
    await getDonatorsByWalletAddress(
      process.argv[2],
      process.argv[3],
      process.argv[4],
    );
  }
}

export default async function getDonatorsByWalletAddress(
  walletAddress: string,
  size: string,
  pageNum: string,
) {
  const pageSize = parseInt(size);
  const pageNumber = parseInt(pageNum);

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

main();
