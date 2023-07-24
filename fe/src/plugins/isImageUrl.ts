export const isImageLink = async (url: string): Promise<boolean> => {
  isLoading.value = true;
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");

    const isImage = contentType && contentType.startsWith("image/");
    isLoading.value = false;
    return !!isImage;
  } catch (e) {
    isLoading.value = false;
    return false;
  }
};
