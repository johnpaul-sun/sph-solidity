import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async () => {
  const router = useRouter();
  const CONTRACT_ADDRESS = "0x5eDF1C24a5Fb69eEb7053c7658bEAb6eB8767837";

  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.BrowserProvider(ethereum);
  let smartContract: ethers.Contract | null = null;
  let signer = null;

  const walletStore = useWalletStore();
  const { getRecentCampaigns } = walletStore;

  const getSmartContract = async () => {
    if (ethereum?.selectedAddress !== null) {
      try {
        signer = await provider.getSigner();
        smartContract = new ethers.Contract(
          CONTRACT_ADDRESS as string,
          contract.abi,
          signer,
        );

        return smartContract;
      } catch (error) {
        const walletConnectionError = "UNKNOWN_ERROR";

        if ((error as { code: string }).code === walletConnectionError) {
          toast.error("Wallet connection failed!");
        } else {
          toast.error("Something went wrong!");
        }
        return null;
      }
    } else {
      smartContract = new ethers.Contract(
        CONTRACT_ADDRESS as string,
        contract.abi,
        provider,
      );

      return smartContract;
    }
  };

  if (ethereum?.selectedAddress !== null) {
    try {
      signer = await provider.getSigner();
      smartContract = new ethers.Contract(
        CONTRACT_ADDRESS as string,
        contract.abi,
        signer,
      );
    } catch (error) {}
  }

  smartContract?.on("CampaignCreated", (sender, title) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success(`Campaign ${title} was successfully created!`);
      useWalletStore().updateState();
      getRecentCampaigns(6, getSmartContract);
    }
  });

  smartContract?.on("DonationSent", (sender) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success("Fund successfully sent!");
      useWalletStore().updateState();
    }
  });

  smartContract?.on("CampaignEdited", (sender, title) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      useWalletStore().updateState();
      setTimeout(function () {
        toast.success(`Campaign ${title} was successfully updated!`);
      }, 300);
      router.back();
    }
  });

  smartContract?.on("Refunded", (sender) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      useWalletStore().updateState();
      toast.success("Fund successfully sent!");
    }
  });

  return {
    provide: {
      provider,
      signer,
      contractInterface,
      getSmartContract,
    },
  };
});
