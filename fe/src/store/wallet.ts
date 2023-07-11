import { defineStore } from "pinia";

export interface WalletStore {
  isConnected: boolean;
  address: string;
  balance: number;
  isShowModal: boolean;
}

export const useWalletStore = defineStore("walletStore", {
  state: (): WalletStore => ({
    isConnected: false,
    address: "",
    balance: 0,
    isShowModal: false,
  }),
  actions: {
    updateStatus(status: boolean, address: string): void {
      this.isConnected = status;
      this.address = address;
    },
    updateBalance(balance: number): void {
      this.balance = balance;
    },
    updateIsShowModal(status: boolean): void {
      this.isShowModal = status;
    },
  },
});
