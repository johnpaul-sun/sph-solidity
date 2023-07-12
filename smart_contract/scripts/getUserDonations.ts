import { utils } from "ethers";
import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";

type UserDonationsResult = [
  CrowdFunding.DonationDataStructOutput[],
  CrowdFunding.PaginationDataStructOutput,
];

async function main() {
  if (
    process.argv[2] !== undefined && // user address
    process.argv[3] !== undefined && // page size
    process.argv[4] !== undefined // page number
  ) {
    await getUserDonations(
      process.argv[2], // user address
      Number(process.argv[3]), // page size
      Number(process.argv[4]), // page number
    );
  }
}

export default async function getUserDonations(
  userAddress: string,
  pageSize: number,
  pageNumber: number,
) {
  console.log("FETCHING...\n");
  await crowdFundingContract
    .getUserDonations(userAddress, pageSize, pageNumber)
    .then((result: UserDonationsResult) => {
      result[0].forEach((donation) => {
        console.log("CAMPAIGN TITLE: ", donation.campaignTitle);
        console.log("CREATOR: ", donation.userAddress);
        console.log(
          "DONATION AMOUNT: ",
          utils.formatEther(donation.donationAmount),
          " ETH",
        );
        console.log("----------------------------------");
      });

      console.log("Total Pages: ", result[1].totalPages.toNumber());
      console.log("Next Page: ", result[1].nextPage.toNumber());
      console.log("Previous Page: ", result[1].previousPage.toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
