import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async () => {
  const router = useRouter();

  const CONTRACT_ADDRESS = "0xB91DFe6eC6d5DCd1Bf477b9F60ed020815C02c27";

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
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success(`Campaign ${title} was successfully created!`);
      useWalletStore().updateState();
      getRecentCampaigns(6, getSmartContract);
      smartContract?.removeAllListeners("CampaignCreated");
    }
  });

  smartContract?.on("DonationSent", (sender) => {
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success("Fund successfully sent!");
      useWalletStore().updateState();
      smartContract?.removeAllListeners("DonationSent");
    }
  });

  smartContract?.on("CampaignEdited", (sender, title) => {
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      useWalletStore().updateState();
      setTimeout(function () {
        toast.success(`Campaign ${title} was successfully updated!`);
      }, 300);
      router.back();
      smartContract?.removeAllListeners("CampaignEdited");
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
