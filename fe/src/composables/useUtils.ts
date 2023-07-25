import { BigNumberish } from "ethers";
import { Id, toast } from "vue3-toastify";

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

    return date.toISOString().split("T")[0];
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

  return {
    truncate,
    middleTruncate,
    getDaysLeft,
    getDateYMD,
    getAvatarUrl,
    notConnectedWarning,
    debounce,
  };
};
