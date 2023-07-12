import { ethers } from "ethers";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async () => {
  const { isConnected } = storeToRefs(useWalletStore());
  const router = useRouter();
  const CONTRACT_ADDRESS = "0xb31B842605e94EfA3202caCC9a86B32b6F8592A2";

  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.BrowserProvider(ethereum);
  let smartContract: ethers.Contract | null = null;
  let signer = null;

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
        toast.error("Something went wrong!");
        return null;
      }
    } else {
      isConnected.value = false;
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
