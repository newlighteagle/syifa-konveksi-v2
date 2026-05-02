import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export type SiteVisitorStats = {
  totalVisitors: number;
  uniqueVisitors: number;
};

type HeaderReader = Pick<Headers, "get">;

const IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "true-client-ip",
] as const;

export function getPublicIpFromHeaders(headers: HeaderReader) {
  for (const headerName of IP_HEADERS) {
    const headerValue = headers.get(headerName);
    const ipAddress = headerValue?.split(",")[0]?.trim();

    if (ipAddress) {
      return ipAddress;
    }
  }

  return "unknown";
}

export async function recordSiteVisit(ipAddress: string) {
  if (!hasDatabaseUrl()) {
    return;
  }

  try {
    await prisma.siteVisitor.upsert({
      where: { ipAddress },
      update: { visits: { increment: 1 } },
      create: { ipAddress },
    });
  } catch (error) {
    console.error("Unable to record site visit:", error);
  }
}

export async function getSiteVisitorStats(): Promise<SiteVisitorStats> {
  if (!hasDatabaseUrl()) {
    return { totalVisitors: 0, uniqueVisitors: 0 };
  }

  try {
    const [totalVisitors, uniqueVisitors] = await Promise.all([
      prisma.siteVisitor.aggregate({ _sum: { visits: true } }),
      prisma.siteVisitor.count(),
    ]);

    return {
      totalVisitors: totalVisitors._sum.visits ?? 0,
      uniqueVisitors,
    };
  } catch (error) {
    console.error("Unable to load site visitor stats:", error);
    return { totalVisitors: 0, uniqueVisitors: 0 };
  }
}
