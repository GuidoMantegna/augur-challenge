// @ts-ignore
import { sources } from "../../server/data";

/**
 * Returns a human-readable string representing the time elapsed
 * since the given ISO string timestamp.
 *
 * The string will be in the format "Xh ago" if the time
 * elapsed is greater than an hour, or "Xm ago" if the time
 * elapsed is less than an hour.
 * 
 * @param isoString - The ISO string timestamp to convert.
 * @returns A human-readable string representing the time elapsed (e.g., "2h ago").
 */

export function timeAgoHM(isoString: string) {
  const past = new Date(isoString);
  const diffMs = Date.now() - past.getTime();

  if (diffMs < 0) return "just now";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ago`;
  }
  return `${minutes}m ago`;
}

/**
 * Returns an array of page numbers suitable for display in a pagination
 * component. The array will contain numbers and/or the string "..."
 * depending on the current page and total number of pages.
 * 
 * If the total number of pages is 3 or fewer, the array will contain
 * all page numbers. Otherwise, the array will contain the first page
 * number, and then one of the following three options depending on the
 * current page number:
 *   - If the current page number is near the start (i.e., <= 3),
 *     the array will contain the page numbers 2 and 3, followed by
 *     "...", and then the last page number.
 *   - If the current page number is near the end (i.e., >= total - 2),
 *     the array will contain "...", followed by the page numbers total - 2
 *     and total - 1, and then the last page number.
 *   - If the current page number is in the middle, the array will contain
 *     "...", followed by the page numbers current - 1, current, and
 *     current + 1, followed by "...", and then the last page number.
 * 
 * @param current - The current page number.
 * @param total - The total number of pages.
 * @returns An array of page numbers suitable for display in a pagination
 * component.
 */
export function getPageNumbers(current: number, total: number): (number | "...")[] {
  // 3 or fewer pages — show them all
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always show first page
  pages.push(1);

  // Near the start: 1 2 3 ... last
  if (current <= 3) {
    pages.push(2, 3);
    if (total > 4) pages.push("...");
    pages.push(total);
    return pages;
  }

  // Near the end: 1 ... (n-2) (n-1) n
  if (current >= total - 2) {
    pages.push("...");
    pages.push(total - 2, total - 1, total);
    return pages;
  }

  // Middle: 1 ... (c-1) c (c+1) ... last
  pages.push("...");
  pages.push(current - 1, current, current + 1);
  pages.push("...");
  pages.push(total);

  return pages;
}

/**
 * Returns a random tag color from a predefined list of colors.
 * @returns A random tag color from the list ["red", "blue", "purple", "teal", "gray"].
 */
export const randomTagColor = () => {
  const colors = ["red", "blue", "purple", "teal", "gray"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export const SELECT_OPTIONS = {
  severities: ["Critical", "High", "Medium", "Low"],
  types: ["IP Address", "Domain", "File Hash", "URL"],
  sources,
}