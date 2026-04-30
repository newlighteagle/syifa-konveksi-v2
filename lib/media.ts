export function getInstagramEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const isInstagram =
      parsedUrl.hostname === "instagram.com" ||
      parsedUrl.hostname === "www.instagram.com";

    if (!isInstagram) {
      return null;
    }

    const [, type, shortcode] = parsedUrl.pathname.split("/");

    if (!["p", "reel", "tv"].includes(type) || !shortcode) {
      return null;
    }

    return `https://www.instagram.com/${type}/${shortcode}/embed`;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}
