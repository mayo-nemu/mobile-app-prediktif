// Lower AHS = more urgent. Machines with no AHS score yet are pushed to the end
// rather than treated as most urgent - missing data isn't the same as a bad score.
export function sortByUrgency<T extends { ahs: number | null }>(machines: T[]): T[] {
  return [...machines].sort((a, b) => {
    if (a.ahs === null && b.ahs === null) return 0;
    if (a.ahs === null) return 1;
    if (b.ahs === null) return -1;
    return a.ahs - b.ahs;
  });
}
