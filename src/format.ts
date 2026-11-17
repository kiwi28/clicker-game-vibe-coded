/** Number formatting for the HUD and costs (K/M/B/T abbreviation). */

const UNITS = ["", "K", "M", "B", "T"] as const;

/**
 * Formats a number for display: raw below 1,000, then 1.2K / 3.4M / 1.1B /
 * 2.9T with up to one decimal. Values are floored so partial MAME never round
 * up to a whole unit the player does not have.
 */
export function formatNumber(value: number): string {
	const whole = Math.floor(value);
	if (whole < 1000) return whole.toString();

	let tier = 0;
	let scaled = whole;
	while (scaled >= 1000 && tier < UNITS.length - 1) {
		scaled /= 1000;
		tier += 1;
	}

	let rounded = Math.round(scaled * 10) / 10;
	// Rounding 999.95 → 1000.0 would show "1000K"; bump to the next unit.
	if (rounded >= 1000 && tier < UNITS.length - 1) {
		tier += 1;
		rounded = 1;
	}

	const unit = UNITS[tier] ?? "";
	const text = Number.isInteger(rounded)
		? rounded.toString()
		: rounded.toFixed(1);
	return `${text}${unit}`;
}

/**
 * Formats the header MAME total with up to two decimals (rounded), keeping the
 * K/M/B/T abbreviation for large values.
 */
export function formatMAME(value: number): string {
	const rounded = Math.round(value * 100) / 100;
	if (rounded < 1000) return trimDecimals(rounded);

	let tier = 0;
	let scaled = rounded;
	while (scaled >= 1000 && tier < UNITS.length - 1) {
		scaled /= 1000;
		tier += 1;
	}

	// Re-round after scaling so 999.995K does not read "1000K".
	let display = Math.round(scaled * 100) / 100;
	if (display >= 1000 && tier < UNITS.length - 1) {
		tier += 1;
		display = 1;
	}

	return `${trimDecimals(display)}${UNITS[tier] ?? ""}`;
}

/** Rounds to two decimals and drops trailing zeros (e.g. 12.3, not 12.30). */
function trimDecimals(value: number): string {
	return value.toFixed(2).replace(/\.?0+$/, "");
}
