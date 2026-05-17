/** Keeps grids readable on typical phones without measuring the viewport. */
const MIN_COLS = 10;
const MAX_COLS = 14;

/**
 * Pick rows × columns: prefer divisors (equal seats per row), else minimise a sparse last row.
 */
export function computeSeatGridLayout(totalSeats) {
  const n = Math.max(0, Math.floor(Number(totalSeats) || 0));
  if (n === 0) return { columns: 0, rows: 0 };

  const maxCols = Math.min(MAX_COLS, n);
  const minCols = Math.min(MIN_COLS, maxCols);

  const sqrt = Math.sqrt(n);
  let bestCols = minCols;
  let bestPriority = Infinity;

  const consider = (cols, priority) => {
    if (cols < minCols || cols > maxCols) return;
    if (priority < bestPriority) {
      bestPriority = priority;
      bestCols = cols;
    }
  };

  for (let d = minCols; d <= maxCols; d++) {
    if (n % d !== 0) continue;
    consider(d, Math.abs(d - sqrt));
  }

  if (bestPriority !== Infinity) {
    return { columns: bestCols, rows: n / bestCols };
  }

  bestPriority = Infinity;

  for (let c = minCols; c <= maxCols; c++) {
    const rows = Math.ceil(n / c);
    const lastRow = n - (rows - 1) * c;

    let penalty = c - lastRow;
    if (rows >= 2) {
      if (lastRow <= 1) penalty += 800;
      else if (lastRow === 2) penalty += 300;
      else if (lastRow <= 4) penalty += 80;
      else if (lastRow < Math.ceil(c * 0.4)) penalty += 28;
    }

    consider(c, penalty * 50 + Math.abs(c - sqrt));
  }

  const rows = Math.ceil(n / bestCols);
  return { columns: bestCols, rows };
}
