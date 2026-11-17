/** Background music + click sound effects with per-source volume, mute, and fades. */

import musicTracks from "virtual:music-tracks";

const CLICK_SRC = "/audio/click.wav";
const MUSIC_VOLUME_KEY = "maica-ta-clicker:musicVolume";
const CLICK_VOLUME_KEY = "maica-ta-clicker:clickVolume";
const LEGACY_VOLUME_KEY = "maica-ta-clicker:volume";
const MUTED_KEY = "maica-ta-clicker:muted";
const DEFAULT_VOLUME = 0.5;
const FADE_IN_SECONDS = 1.5;
const FADE_OUT_SECONDS = 1.0;
/** How long after the last click the music keeps playing before fading out. */
const IDLE_FADE_DELAY_SECONDS = 5;

interface Track {
	url: string;
	name: string;
}

/** Every `.mp3` dropped into `public/audio/music/`, in stable (sorted) order. */
const PLAYLIST: readonly Track[] = musicTracks;

let context: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicVolumeGain: GainNode | null = null;
let clickVolumeGain: GainNode | null = null;

let musicEl: HTMLAudioElement | null = null;
let sourceConnected = false;
let currentIndex = -1;

let clickBuffer: AudioBuffer | null = null;
let clickDecoding: Promise<AudioBuffer> | null = null;
let clickBytes: ArrayBuffer | null = null;
let clickBytesLoading: Promise<ArrayBuffer> | null = null;

let idleFaded = false;
let idleTimeout: number | null = null;

let musicVolume = loadVolume(MUSIC_VOLUME_KEY);
let clickVolume = loadVolume(CLICK_VOLUME_KEY);
let muted = loadMuted();

function clamp01(value: number): number {
	return Math.min(1, Math.max(0, value));
}

/** Loads a stored volume, falling back to the old single-volume key, then default. */
function loadVolume(key: string): number {
	try {
		const raw = localStorage.getItem(key) ?? localStorage.getItem(LEGACY_VOLUME_KEY);
		if (raw === null) return DEFAULT_VOLUME;
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? clamp01(parsed) : DEFAULT_VOLUME;
	} catch {
		return DEFAULT_VOLUME;
	}
}

function loadMuted(): boolean {
	try {
		return localStorage.getItem(MUTED_KEY) === "true";
	} catch {
		return false;
	}
}

function persist(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Storage unavailable — fail silently.
	}
}

function persistMuted(value: boolean): void {
	persist(MUTED_KEY, value ? "true" : "false");
}

/**
 * Builds the audio graph once, on the first user gesture, so the browser's
 * autoplay policy never blocks a suspended `AudioContext` created at load.
 */
function ensureContext(): AudioContext {
	if (context === null) {
		context = new AudioContext();

		musicVolumeGain = context.createGain();
		musicVolumeGain.gain.value = musicVolume;
		musicVolumeGain.connect(context.destination);

		clickVolumeGain = context.createGain();
		clickVolumeGain.gain.value = muted ? 0 : clickVolume;
		clickVolumeGain.connect(context.destination);

		musicGain = context.createGain();
		musicGain.gain.value = muted ? 0 : 1;
		musicGain.connect(musicVolumeGain);
	}
	return context;
}

function ensureMusic(): HTMLAudioElement {
	if (musicEl === null) {
		musicEl = new Audio();
		musicEl.preload = "auto";
		musicEl.loop = false;
		musicEl.addEventListener("ended", () => {
			if (PLAYLIST.length === 0) return;
			playTrackAt((currentIndex + 1) % PLAYLIST.length, false);
		});
	}
	return musicEl;
}

/** Wires the media element into the gain graph once (a source can only be set up once). */
function ensureMusicGraph(): void {
	const ctx = ensureContext();
	const el = ensureMusic();
	if (musicGain !== null && !sourceConnected) {
		const source = ctx.createMediaElementSource(el);
		source.connect(musicGain);
		sourceConnected = true;
		musicGain.gain.cancelScheduledValues(ctx.currentTime);
		musicGain.gain.setValueAtTime(0, ctx.currentTime);
	}
}

/** The track currently loaded/playing, or `null` before playback starts. */
function currentTrack(): Track | null {
	return PLAYLIST[currentIndex] ?? null;
}

/** Loads the track at `index`, returning false when there is no such track. */
function setTrack(index: number): boolean {
	const track = PLAYLIST[index];
	if (track === undefined) return false;
	currentIndex = index;
	ensureMusic().src = track.url;
	return true;
}

/** A random starting index for the first track (or -1 when the playlist is empty). */
function randomStartIndex(): number {
	if (PLAYLIST.length === 0) return -1;
	return Math.floor(Math.random() * PLAYLIST.length);
}

/** Ensures the context is running and the media element is connected to the graph. */
function ensurePlayback(): void {
	const ctx = ensureContext();
	if (ctx.state === "suspended") void ctx.resume();
	ensureMusicGraph();
}

/** Loads `index` and plays it; fades music back in only on an explicit user action. */
function playTrackAt(index: number, fromUser: boolean): void {
	if (!setTrack(index)) return;
	ensurePlayback();
	if (fromUser) markActivity();
	void ensureMusic().play().catch(() => {
		// Autoplay blocked or asset missing — ignore.
	});
}

/** Starts/resumes the music on a user gesture (picks a random track the first time). */
function activateMusic(): void {
	ensurePlayback();
	if (currentIndex < 0) setTrack(randomStartIndex());
	markActivity();
	void ensureMusic().play().catch(() => {
		// Autoplay blocked or asset missing — ignore.
	});
}

/** Smoothly ramps the music envelope to `target` (0 or 1) over `seconds`. */
function rampMusicGain(target: number, seconds: number): void {
	if (context === null || musicGain === null) return;
	const now = context.currentTime;
	const param = musicGain.gain;
	param.cancelScheduledValues(now);
	param.setValueAtTime(param.value, now);
	param.linearRampToValueAtTime(target, now + seconds);
}

/** True when the music should currently be audible. */
function musicShouldPlay(): boolean {
	return !muted && !idleFaded;
}

/** Fades the music toward its current target (in on play, out on stop). */
function syncMusicEnvelope(): void {
	const target = musicShouldPlay() ? 1 : 0;
	rampMusicGain(target, target === 1 ? FADE_IN_SECONDS : FADE_OUT_SECONDS);
}

/** Resets the idle fade timer so music keeps playing while the user is active. */
function scheduleIdleFade(): void {
	if (idleTimeout !== null) {
		window.clearTimeout(idleTimeout);
	}
	idleTimeout = window.setTimeout(() => {
		idleTimeout = null;
		if (!idleFaded) {
			idleFaded = true;
			syncMusicEnvelope();
		}
	}, IDLE_FADE_DELAY_SECONDS * 1000);
}

/** Marks activity: fade music back in and restart the idle countdown. */
function markActivity(): void {
	idleFaded = false;
	scheduleIdleFade();
	syncMusicEnvelope();
}

function ensureClickBytes(): Promise<ArrayBuffer> {
	if (clickBytes !== null) return Promise.resolve(clickBytes);
	if (clickBytesLoading === null) {
		clickBytesLoading = fetch(CLICK_SRC)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to load click sound (${response.status})`);
				}
				return response.arrayBuffer();
			})
			.then((data) => {
				clickBytes = data;
				return data;
			});
	}
	return clickBytesLoading;
}

/** Decodes the click sample into a reusable `AudioBuffer` (once). */
function ensureClickBuffer(): Promise<AudioBuffer> {
	if (clickBuffer !== null) return Promise.resolve(clickBuffer);
	if (clickDecoding === null) {
		const ctx = ensureContext();
		clickDecoding = ensureClickBytes().then((data) =>
			ctx.decodeAudioData(data).then((buffer) => {
				clickBuffer = buffer;
				return buffer;
			}),
		);
	}
	return clickDecoding;
}

/**
 * Preloads the music element and the click sample's bytes (no `AudioContext`,
 * so nothing is blocked before a user gesture).
 */
export function initAudio(): void {
	ensureMusic();
	void ensureClickBytes().catch(() => undefined);
}

/**
 * Handles one mom click: unlocks audio on the first click (autoplay policy),
 * fades the music back in, restarts the idle countdown, and plays the click
 * sample. Called on every click.
 */
export function onClick(): void {
	activateMusic();

	if (!muted) {
		void ensureClickBuffer().then((buffer) => {
			if (context === null || clickVolumeGain === null) return;
			const source = context.createBufferSource();
			source.buffer = buffer;
			source.connect(clickVolumeGain);
			source.start();
		});
	}
}

/** Skips to the next track (wrapping around). */
export function nextTrack(): void {
	if (PLAYLIST.length === 0) return;
	playTrackAt((currentIndex + 1) % PLAYLIST.length, true);
}

/** Skips back to the previous track (wrapping around). */
export function previousTrack(): void {
	if (PLAYLIST.length === 0) return;
	playTrackAt((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length, true);
}

/** True while the music element is actively playing (not paused). */
export function isPlaying(): boolean {
	return musicEl !== null && !musicEl.paused;
}

/** Pauses a playing track, or resumes/starts playback when paused. */
export function togglePlayPause(): void {
	if (isPlaying()) {
		ensureMusic().pause();
	} else {
		activateMusic();
	}
}

/** Display name of the current track ("" before playback starts). */
export function getTrackName(): string {
	const track = currentTrack();
	return track === null ? "" : track.name;
}

export interface TrackProgress {
	elapsed: number;
	duration: number;
}

/** Playback position (seconds) and total duration of the current track. */
export function getTrackProgress(): TrackProgress {
	if (musicEl === null) return { elapsed: 0, duration: 0 };
	const elapsed = Number.isFinite(musicEl.currentTime) ? musicEl.currentTime : 0;
	const duration = Number.isFinite(musicEl.duration) ? musicEl.duration : 0;
	return { elapsed, duration };
}

export function getMusicVolume(): number {
	return musicVolume;
}

export function getClickVolume(): number {
	return clickVolume;
}

export function isMuted(): boolean {
	return muted;
}

/** Sets the music volume (0–1), applied instantly. */
export function setMusicVolume(next: number): void {
	musicVolume = clamp01(next);
	persist(MUSIC_VOLUME_KEY, musicVolume.toString());
	if (musicVolumeGain !== null) {
		musicVolumeGain.gain.value = musicVolume;
	}
}

/** Sets the click volume (0–1), applied instantly (and still gated by mute). */
export function setClickVolume(next: number): void {
	clickVolume = clamp01(next);
	persist(CLICK_VOLUME_KEY, clickVolume.toString());
	if (clickVolumeGain !== null) {
		clickVolumeGain.gain.value = muted ? 0 : clickVolume;
	}
}

/** Mutes (fades music out) or unmutes (fades music in) everything. */
export function setMuted(next: boolean): void {
	if (muted === next) return;
	muted = next;
	persistMuted(muted);

	if (clickVolumeGain !== null) {
		clickVolumeGain.gain.value = muted ? 0 : clickVolume;
	}
	syncMusicEnvelope();
}
