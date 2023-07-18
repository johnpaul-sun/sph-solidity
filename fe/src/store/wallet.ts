import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { ethers } from "ethers";
import RecentCampaignData from "~/types/RecentCampaignData";

export interface WalletStore {
  isConnected: boolean;
  address: string;
  balance: number;
  isShowModal: boolean;
  recentCampaign: RecentCampaignData[] | undefined;
}

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStore => ({
    isConnected: false,
    address: "",
    balance: 0,
    isShowModal: false,
    recentCampaign: [],
  }),
  actions: {
    updateStatus(status: boolean, address: string) {
      this.isConnected = status;
      this.address = address;
    },
    updateBalance(balance: number) {
      this.balance = balance;
    },
    updateIsShowModal(status: boolean) {
      this.isShowModal = status;
    },
    async getRecentCampaigns(
      pageSize: number,
      getSmartContract: () => Promise<ethers.Contract | null>,
    ) {
      type ResultData = [
        number,
        string,
        string,
        string,
        string,
        number,
        number,
        number,
        number,
      ][];

      try {
        const smartContract = await getSmartContract();

        if (smartContract !== null) {
          const result = await smartContract.getRecentCampaigns(pageSize);
          const campaignData: RecentCampaignData[] = (
            result[0] as ResultData
          ).map((item) => ({
            id: item[0],
            creator: item[1],
            fullname: item[2],
            title: item[3],
            story: item[4],
            goalAmount: item[5],
            currentAmount: item[6],
            deadline: item[7],
            totalDonations: item[8],
          }));

          this.recentCampaign = campaignData.reverse();
        }
      } catch (error) {
        if (process.client) {
          if ((error as { code: string }).code === "UNCONFIGURED_NAME") return;
          toast.error("Something went wrong!");
        }
      }
    },
  },
});
