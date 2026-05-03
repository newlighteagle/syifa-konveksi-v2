"use client";

import { useEffect } from "react";

export function SiteVisitTracker() {
  useEffect(() => {
    const endpoint = "/api/visits";

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      keepalive: true,
    });
  }, []);

  return null;
}
