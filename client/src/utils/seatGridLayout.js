/**
 * Pick rows × columns for a seat map so layouts look like real theatres:
 * prefer equal seats per row (columns divides total); otherwise minimise a tiny last row.
 */
export function computeSeatGridLayout(totalSeats, opts = {}) {
  const minCols = opts.minCols ?? 10;
  const maxCols = opts.maxCols ?? 24;

  const n = Math.max(0, Math.floor(Number(totalSeats) || 0));
  if (n === 0) return { columns: 0, rows: 0 };

  if (n < minCols) {
    return { columns: n, rows: 1 };
  }

  const sqrt = Math.sqrt(n);

  let bestCols = minCols;
  let bestPriority = Infinity;

  const consider = (cols, priority) => {
    if (cols < minCols || cols > maxCols || cols > n) return;
    if (priority < bestPriority) {
      bestPriority = priority;
      bestCols = cols;
    }
  };

  for (let d = minCols; d <= Math.min(maxCols, n); d++) {
    if (n % d !== 0) continue;
    const rows = n / d;
    consider(d, Math.abs(d - sqrt) + rows * 0.001);
  }

  if (bestPriority !== Infinity) {
    return { columns: bestCols, rows: n / bestCols };
  }

  bestPriority = Infinity;

  for (let c = minCols; c <= Math.min(maxCols, n); c++) {
    const rows = Math.ceil(n / c);
    const lastRow = n - (rows - 1) * c;

    let penalty = c - lastRow;
    if (rows >= 2) {
      if (lastRow === 1) penalty += 800;
      else if (lastRow === 2) penalty += 200;
      else if (lastRow <= 3) penalty += 80;
      else if (lastRow < Math.max(5, Math.ceil(c * 0.35))) penalty += 35;
    }

    consider(c, penalty * 100 + Math.abs(c - sqrt));
  }

  const rows = Math.ceil(n / bestCols);
  return { columns: bestCols, rows };
}
