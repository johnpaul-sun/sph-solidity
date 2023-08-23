import { BigNumberish } from "ethers";
import { Id, toast } from "vue3-toastify";
import { useWalletStore } from "~/store/wallet";

export const useUtils = () => {
  const truncate = (text: string, length: number): string => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    } else {
      return text;
    }
  };

  const middleTruncate = (
    address: string,
    startLength: number,
    endLength: number,
  ): string => {
    if (address.length <= startLength + endLength) {
      return address;
    }
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return start + "..." + end;
  };

  const getDaysLeft = (dateInt: BigNumberish): number => {
    const dateNow: Date = new Date();
    const dateNew: Date = new Date(Number(dateInt) * 1000);
    const timeDiff: number = dateNew.getTime() - dateNow.getTime();

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getDateYMD = (dateInt: BigNumberish): string => {
    const date: Date = new Date(Number(dateInt) * 1000);

    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();

    return year + "-" + month + "-" + day;
  };

  const notConnectedWarning = (duration = 1500): Id => {
    return toast.warning("Connect wallet first!", { autoClose: duration });
  };

  const getAvatarUrl = (id: string): string => {
    return `https://api.multiavatar.com/${id.toLowerCase()}.png`;
  };

  const debounce = (fn = () => { }, delay = 500) => {
    let timeout: NodeJS.Timeout;
    return (...args: []) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const copyAddress = (address: string): void => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Address copied successfully!", { autoClose: 1500 });
      })
      .catch(() => {
        toast.error("Failed to copy address!", { autoClose: 1500 });
      });
  };

  const campaignStatusChecker = (
    currentAmount: BigNumberish,
    goalAmount: BigNumberish,
    deadline: BigNumberish,
  ) => {
    const isCampaignExpired = getDaysLeft(deadline) <= 0;
    const isCampaignAchieved = currentAmount >= goalAmount;

    if (isCampaignExpired || isCampaignAchieved) {
      return true;
    }

    return false;
  };

  const showCampaignIdError = () => {
    showError({
      statusCode: 404,
      statusMessage: "Invalid campaign ID",
    });
  };

  const getRefund = async (id: number, address: string) => {
    const { $getSmartContract: getSmartContract } = useNuxtApp();
    const smartContract = await getSmartContract();

    if (smartContract !== null) {
      smartContract
        .returnDonationsIfExpired(id, address)
        .then(() => {
          useWalletStore().updateState();
          toast.info("Fund transfer in progress...");
        })
        .catch((error) => {
          if (error.reason === "rejected") {
            toast.error("Refund rejected!");
          } else {
            toast.error(error.reason);
          }
        });
    }
  };

  const sameString = (str1: string, str2: string) => {
    return str1.toLocaleLowerCase() === str2.toLocaleLowerCase();
  };

  const redirectToCampaign = (id: number) => {
    const router = useRouter();
    router.push(`/campaigns/${id}`);
  };

  return {
    truncate,
    middleTruncate,
    getDaysLeft,
    getDateYMD,
    getAvatarUrl,
    notConnectedWarning,
    debounce,
    copyAddress,
    campaignStatusChecker,
    showCampaignIdError,
    getRefund,
    sameString,
    redirectToCampaign,
  };
};
