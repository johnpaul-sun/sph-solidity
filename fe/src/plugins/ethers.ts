import { ethers } from "ethers";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async (app) => {
  const { isConnected } = storeToRefs(useWalletStore());
  const CONTRACT_ADDRESS = app.$config.public.CONTRACT_ADDRESS;

  let smartContract = null;
  let signer = null;
  const ethereum = (window as any).ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.Interface(contract.abi);

  if (ethereum.isConnected) {
    signer = await provider.getSigner();

    smartContract = new ethers.Contract(
      CONTRACT_ADDRESS as string,
      contract.abi,
      signer
    );

    smartContract.on("CampaignCreated", (sender, id) => {
      if (sender.toLowerCase() === ethereum.selectedAddress.toLowerCase()) {
        toast.success(`Campaign with ID: ${Number(id)} successfully Created!`);
      }
    });
  } else {
    isConnected.value = false;
  }

  return {
    provide: {
      provider,
      signer,
      contractInterface,
      smartContract,
    },
  };
});
