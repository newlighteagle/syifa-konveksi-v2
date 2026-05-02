"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductShareData } from "@/lib/share";

type ShareStatus = "idle" | "copied" | "shared" | "failed";

export function ProductShareButton({ shareData }: { shareData: ProductShareData }) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);

  useEffect(() => {
    setSupportsNativeShare("share" in navigator);
  }, []);

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setStatus("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function onShare() {
    try {
      if (supportsNativeShare) {
        await navigator.share(shareData);
        setStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setStatus("copied");
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }

      setStatus("failed");
    }
  }

  const isSuccess = status === "copied" || status === "shared";

  return (
    <div className="flex-1">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onShare}
        aria-live="polite"
      >
        {isSuccess ? <Check /> : supportsNativeShare ? <Share2 /> : <Copy />}
        {status === "copied" ? "Link disalin" : status === "shared" ? "Berhasil dibagikan" : "Bagikan"}
      </Button>
      {status === "failed" ? (
        <p className="mt-2 text-center text-xs font-medium text-slate-500">
          Link belum bisa disalin. Salin URL dari address bar.
        </p>
      ) : null}
    </div>
  );
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
