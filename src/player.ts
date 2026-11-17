/**
 * Desktop music-player controls: skip/previous/pause buttons that expand on
 * hover/focus (and briefly whenever a new song starts), plus a scrolling track
 * name and elapsed/total time.
 */

import playIcon from "@tabler/icons/filled/player-play.svg?raw";
import pauseIcon from "@tabler/icons/filled/player-pause.svg?raw";
import nextIcon from "@tabler/icons/filled/player-skip-forward.svg?raw";
import prevIcon from "@tabler/icons/filled/player-skip-back.svg?raw";
import {
	getTrackName,
	getTrackProgress,
	isPlaying,
	nextTrack,
	previousTrack,
	togglePlayPause,
} from "./audio";

/** Marquee speed in pixels per second. */
const MARQUEE_PX_PER_SEC = 40;
/** How long the player stays expanded after hover/focus ends or a song starts. */
const COLLAPSE_DELAY_MS = 5000;

function byId(id: string): HTMLElement {
	const element = document.getElementById(id);
	if (element === null) throw new Error(`Missing element #${id}`);
	return element;
}

/** Formats a duration (seconds) as `m:ss`. */
function formatTime(totalSeconds: number): string {
	const seconds = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(seconds / 60);
	const remainder = seconds % 60;
	return `${minutes.toString()}:${remainder.toString().padStart(2, "0")}`;
}

/**
 * Wires the player buttons and marquee and returns a per-frame update function
 * that refreshes the play/pause icon, scrolling track name, and time readout.
 */
export function setupPlayerControls(): () => void {
	const player = byId("player");
	const play = byId("player-play") as HTMLButtonElement;
	const prev = byId("player-prev") as HTMLButtonElement;
	const next = byId("player-next") as HTMLButtonElement;
	const marquee = byId("player-marquee");
	const marqueeTrack = byId("player-marquee-track");
	const time = byId("player-time");

	play.innerHTML = playIcon;
	prev.innerHTML = prevIcon;
	next.innerHTML = nextIcon;

	play.addEventListener("click", togglePlayPause);
	prev.addEventListener("click", previousTrack);
	next.addEventListener("click", nextTrack);

	// Two identical copies make the right-to-left scroll loop seamlessly.
	const first = document.createElement("span");
	first.className = "player__marquee-text";
	const second = document.createElement("span");
	second.className = "player__marquee-text";
	second.setAttribute("aria-hidden", "true");
	marqueeTrack.replaceChildren(first, second);

	// --- Expand/collapse state -------------------------------------------------
	// The `.is-open` class drives the CSS animation. It stays open while the
	// pointer is inside or a button is focused, and closes 5s after the last
	// reason goes away (also used to flash the player on a new song).
	let closeTimer: number | null = null;
	let hovered = false;
	let focused = false;

	function cancelClose(): void {
		if (closeTimer !== null) {
			window.clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	function expand(): void {
		cancelClose();
		player.classList.add("is-open");
	}

	function collapse(): void {
		player.classList.remove("is-open");
	}

	function scheduleCollapse(): void {
		cancelClose();
		closeTimer = window.setTimeout(() => {
			closeTimer = null;
			collapse();
		}, COLLAPSE_DELAY_MS);
	}

	function refresh(): void {
		if (hovered || focused) {
			expand();
		} else {
			scheduleCollapse();
		}
	}

	player.addEventListener("mouseenter", () => {
		hovered = true;
		refresh();
	});
	player.addEventListener("mouseleave", () => {
		hovered = false;
		refresh();
	});
	player.addEventListener("focusin", () => {
		focused = true;
		refresh();
	});
	player.addEventListener("focusout", (event) => {
		const target = event.relatedTarget;
		if (target instanceof Node && player.contains(target)) return;
		focused = false;
		refresh();
	});

	let lastTrackName = "";
	let lastPlaying: boolean | null = null;
	let lastTimeText = "";

	function updateMarquee(): void {
		// One copy's width (text + trailing gap) decides whether it overflows.
		const copyWidth = first.offsetWidth;
		const windowWidth = marquee.clientWidth;
		const scrolling = copyWidth > windowWidth;

		marqueeTrack.classList.toggle("is-scrolling", scrolling);
		if (scrolling) {
			const duration = Math.max(4, copyWidth / MARQUEE_PX_PER_SEC);
			marqueeTrack.style.animationDuration = `${duration.toFixed(2)}s`;
		}
	}

	const update = (): void => {
		const name = getTrackName();
		if (name !== lastTrackName) {
			lastTrackName = name;
			first.textContent = name;
			second.textContent = name;
			updateMarquee();
			// Flash the player open when a new track starts (then auto-close).
			expand();
			refresh();
		}

		const playing = isPlaying();
		if (playing !== lastPlaying) {
			lastPlaying = playing;
			play.innerHTML = playing ? pauseIcon : playIcon;
			play.setAttribute("aria-label", playing ? "Pause" : "Play");
		}

		const progress = getTrackProgress();
		const timeText = `${formatTime(progress.elapsed)} / ${formatTime(progress.duration)}`;
		if (timeText !== lastTimeText) {
			lastTimeText = timeText;
			time.textContent = timeText;
		}
	};

	return update;
}
