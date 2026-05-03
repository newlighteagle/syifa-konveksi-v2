"use client";

import { useEffect } from "react";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const endpoint = `/api/products/${productId}/views`;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      keepalive: true,
    });
  }, [productId]);

  return null;
}
