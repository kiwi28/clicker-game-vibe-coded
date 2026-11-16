/** Background music + click sound effects with per-source volume, mute, and fades. */

const MUSIC_SRC = "/audio/music.mp3";
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

let context: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicVolumeGain: GainNode | null = null;
let clickVolumeGain: GainNode | null = null;

let musicEl: HTMLAudioElement | null = null;
let musicStarted = false;

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
		musicEl = new Audio(MUSIC_SRC);
		musicEl.loop = true;
		musicEl.preload = "auto";
	}
	return musicEl;
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

/** Starts the looping music element once, from silence. */
function startMusicOnce(): void {
	if (musicStarted) return;
	musicStarted = true;
	const ctx = ensureContext();
	const el = ensureMusic();
	if (musicGain !== null) {
		const source = ctx.createMediaElementSource(el);
		source.connect(musicGain);
		musicGain.gain.cancelScheduledValues(ctx.currentTime);
		musicGain.gain.setValueAtTime(0, ctx.currentTime);
	}
	void el.play().catch(() => {
		// Autoplay blocked or asset missing — ignore.
	});
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
	const ctx = ensureContext();
	if (ctx.state === "suspended") {
		void ctx.resume();
	}
	startMusicOnce();
	markActivity();

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
