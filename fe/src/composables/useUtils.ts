export const useUtils = () => {
    const truncate = (text: string, length: number) => {
        if (text.length > length) {
            return text.substring(0, length) + "...";
        } else {
            return text;
        }
    };

    return { truncate };
};
