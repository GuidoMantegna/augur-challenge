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