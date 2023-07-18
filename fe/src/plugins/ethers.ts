import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";

export default defineNuxtPlugin(async () => {
  const CONTRACT_ADDRESS = "0x402BFe8c29aC35947416a94b42de8e87CE20FAB4";

  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.BrowserProvider(ethereum);
  let smartContract: ethers.Contract | null = null;
  let signer = null;

  const getSmartContract = async () => {
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
      smartContract?.removeAllListeners("CampaignCreated");
    }
  });

  smartContract?.on("DonationSent", (sender) => {
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success("Fund successfully sent!");
      smartContract?.removeAllListeners("DonationSent");
    }
  });

  smartContract?.on("CampaignEdited", (sender, title) => {
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
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
