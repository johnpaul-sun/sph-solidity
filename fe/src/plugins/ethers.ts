import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async () => {
  const router = useRouter();
  const CONTRACT_ADDRESS = "0xe8542C4aef0310EA64D83F710433f4AC564484CF";

  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.BrowserProvider(ethereum);
  let smartContract: ethers.Contract | null = null;
  let signer = null;
  let isListenerExecuted = false;

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

  const clearListener = () => {
    setTimeout(() => {
      isListenerExecuted = false;
    }, 3000);
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
      if (!isListenerExecuted) {
        isListenerExecuted = true;
        toast.success(`Campaign ${title} was successfully created!`);
        useWalletStore().updateState();
        clearListener();
      }
    }
  });

  smartContract?.on("DonationSent", (sender) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      if (!isListenerExecuted) {
        isListenerExecuted = true;
        toast.success("Fund successfully sent!");
        useWalletStore().updateState();
        clearListener();
      }
    }
  });

  smartContract?.on("CampaignEdited", (sender, title) => {
    smartContract?.removeAllListeners();
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      if (!isListenerExecuted) {
        isListenerExecuted = true;
        useWalletStore().updateState();
        setTimeout(function () {
          toast.success(`Campaign ${title} was successfully updated!`);
        }, 300);
        router.back();
        clearListener();
      }
    }
  });

  smartContract?.on("Refunded", () => {
    smartContract?.removeAllListeners();
    if (!isListenerExecuted) {
      isListenerExecuted = true;
      useWalletStore().updateState();
      toast.success("Fund successfully sent!");
      clearListener();
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
