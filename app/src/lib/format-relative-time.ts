/**
 * Format a date string as relative time (e.g. "2 days ago", "Posted 1 week ago").
 */

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "Posted just now";
  if (diffMin < 60) return `Posted ${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `Posted ${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `Posted ${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffWeek < 4) return `Posted ${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;
  return `Posted ${Math.floor(diffDay / 30)} month${Math.floor(diffDay / 30) === 1 ? "" : "s"} ago`;
}
