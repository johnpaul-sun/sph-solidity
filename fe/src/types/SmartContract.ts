import { BigNumberish } from "ethers";

export interface SmartContractCampaign {
  id: BigNumberish;
  creator: string;
  fullname: string;
  title: string;
  story: string;
  goalAmount: BigNumberish;
  currentAmount: BigNumberish;
  deadline: BigNumberish;
  totalDonations: BigNumberish;
}

export interface SmartContractDonationTransaction {
  id: BigNumberish;
  campaignId: BigNumberish;
  donor: string;
  amount: BigNumberish;
  timestamp: BigNumberish;
}
