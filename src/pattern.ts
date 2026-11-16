/**
 * Endlessly-scrolling background wallpaper for the click zone.
 *
 * The "maică-ta" arena gets a faint, endlessly-moving backdrop built from the
 * outline variants of assorted junk-food icons (the installed @tabler/icons set).
 * We use outline only so the hero stays a calm, low-contrast texture behind the
 * clickable mom, and tint every glyph a single light green so it reads as one
 * cohesive pattern over the existing dark background.
 *
 * The result is one seamless SVG tile (a 3×3 lattice of icons with the centre
 * cell left empty, where the mom sits) repeated as a `background-image` and
 * scrolled via `background-position`. The tile size is mirrored in `style.css`
 * (see `--pattern-tile` and the `pattern-scroll` keyframes) — keep the two in
 * sync with `TILE` below.
 */

import burgerIcon from "@tabler/icons/outline/burger.svg?raw";
import pizzaIcon from "@tabler/icons/outline/pizza.svg?raw";
import iceCreamIcon from "@tabler/icons/outline/ice-cream.svg?raw";
import cakeIcon from "@tabler/icons/outline/cake.svg?raw";
import cookieIcon from "@tabler/icons/outline/cookie.svg?raw";
import chocolateIcon from "@tabler/icons/outline/chocolate.svg?raw";
import milkshakeIcon from "@tabler/icons/outline/milkshake.svg?raw";
import lollipopIcon from "@tabler/icons/outline/lollipop.svg?raw";

/** Lighter green used for every glyph in the pattern. */
const PATTERN_COLOR = "#8ef2a9";

/** How faint the wallpaper is, so it never competes with the mom or HUD. */
const PATTERN_OPACITY = 0.22;

/** One tile of the repeating pattern, in px. Must match the CSS animation. */
const TILE = 240;

/** Icons sit on a 3×3 lattice per tile; the centre cell stays empty. */
const COLS = 3;
const ROWS = 3;

/** Target glyph size within a tile (a 24-unit icon scaled by `SCALE`). */
const ICON_PX = 48;
const SCALE = ICON_PX / 24;
const PAD = (TILE / COLS - ICON_PX) / 2;

interface Cell {
	icon: string;
	col: number;
	row: number;
}

/** Centre cell (col 1, row 1) is left empty so the mom sits in a clear spot. */
const CELLS: readonly Cell[] = [
	{ icon: burgerIcon, col: 0, row: 0 },
	{ icon: pizzaIcon, col: 1, row: 0 },
	{ icon: iceCreamIcon, col: 2, row: 0 },
	{ icon: cakeIcon, col: 0, row: 1 },
	{ icon: cookieIcon, col: 2, row: 1 },
	{ icon: chocolateIcon, col: 0, row: 2 },
	{ icon: milkshakeIcon, col: 1, row: 2 },
	{ icon: lollipopIcon, col: 2, row: 2 },
];

/** Strips the outer `<svg>` wrapper from a raw icon, leaving its paths. */
function innerSvg(raw: string): string {
	const openEnd = raw.indexOf(">");
	const closeStart = raw.lastIndexOf("</svg>");
	if (openEnd === -1 || closeStart === -1) return "";
	return raw.slice(openEnd + 1, closeStart).trim();
}

/** Renders one icon as a positioned, scaled `<g>` group. */
function renderCell(cell: Cell): string {
	const x = cell.col * (TILE / COLS) + PAD;
	const y = cell.row * (TILE / ROWS) + PAD;
	return [
		`<g transform="translate(${x} ${y}) scale(${SCALE})">`,
		innerSvg(cell.icon),
		"</g>",
	].join("\n");
}

/**
 * Builds a single seamless `TILE`×`TILE` SVG containing every outline icon and
 * returns it as a data URI ready to drop into a `background-image`.
 */
function buildTile(): string {
	const body = CELLS.map(renderCell).join("\n");
	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none" stroke="${PATTERN_COLOR}" stroke-opacity="${PATTERN_OPACITY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
		body,
		"</svg>",
	].join("\n");
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Applies the endlessly-scrolling outline-icon wallpaper to the click zone. */
export function applyClickZonePattern(zone: HTMLElement): void {
	zone.style.setProperty("--pattern-tile", `${TILE}px`);
	zone.style.backgroundImage = `url("${buildTile()}")`;
}
