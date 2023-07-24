const isImageUrl = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");

    const isImage = contentType && contentType.startsWith("image/");

    return !!isImage;
  } catch (e) {
    return false;
  }
};

export default isImageUrl;
