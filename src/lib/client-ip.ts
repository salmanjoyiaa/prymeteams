/**
 * Prefer platform-provided client IP. Do not trust the leftmost
 * X-Forwarded-For hop (clients can spoof it).
 */
export function getClientIp(h: {
  get(name: string): string | null;
}): string {
  const vercel = h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;

  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const xff = h.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    // Rightmost is typically the last trusted proxy hop on many platforms.
    if (parts.length) return parts[parts.length - 1]!;
  }

  return "unknown";
}
