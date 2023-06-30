export const useUtils = () => {
  const truncate = (text: string, length: number) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    } else {
      return text;
    }
  };

  const middleTruncate = (
    address: string,
    startLength: number,
    endLength: number
  ) => {
    if (address.length <= startLength + endLength) {
      return address;
    }
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return start + "..." + end;
  };

  return { truncate, middleTruncate };
};
