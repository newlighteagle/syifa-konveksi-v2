import { getPublicIpFromHeaders, recordSiteVisit } from "@/lib/visitor-service";

export async function POST(request: Request) {
  await recordSiteVisit(getPublicIpFromHeaders(request.headers));

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
