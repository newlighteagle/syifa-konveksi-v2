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

export function getYoutubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const [type, id] = parsedUrl.pathname.split("/").filter(Boolean);

      if (type === "shorts" || type === "embed") {
        videoId = id ?? null;
      }

      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function isDirectImageUrl(url: string) {
  return /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(url);
}
