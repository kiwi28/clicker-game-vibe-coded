import { readdirSync } from "node:fs";
import { basename, extname } from "node:path";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

/**
 * Where songs are dropped. Files placed here are served as-is at
 * `/audio/music/<filename>` and become part of the in-game playlist.
 */
const MUSIC_DIR = "public/audio/music";
const MUSIC_MODULE_ID = "virtual:music-tracks";
const MUSIC_MODULE_RESOLVED = "\0" + MUSIC_MODULE_ID;

interface MusicTrack {
	url: string;
	name: string;
}

/** Reads the drop-in music folder and returns one track per `.mp3` file. */
function readMusicTracks(): MusicTrack[] {
	let files: string[];
	try {
		files = readdirSync(MUSIC_DIR);
	} catch {
		return [];
	}
	return files
		.filter((file) => extname(file).toLowerCase() === ".mp3")
		.map((file) => ({
			url: `/audio/music/${encodeURIComponent(file)}`,
			name: basename(file, extname(file)).replace(/_+/g, " ").trim() || file,
		}))
		.sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * Exposes the current playlist as a virtual module so the browser never needs
 * to enumerate a directory at runtime (impossible on static hosting). Re-scans
 * on every request, so songs dropped into `public/audio/music/` show up on the
 * next dev-server restart or build.
 */
function musicTracksPlugin(): Plugin {
	return {
		name: "music-tracks",
		resolveId(id) {
			if (id === MUSIC_MODULE_ID) return MUSIC_MODULE_RESOLVED;
			return null;
		},
		load(id) {
			if (id !== MUSIC_MODULE_RESOLVED) return null;
			return `export default ${JSON.stringify(readMusicTracks())};`;
		},
	};
}

export default defineConfig({
	base: "./",
	server: {
		watch: {
			ignored: ["**/dist/**", "**/dist.zip", "**/graphify-out/**", "**/public/audio/**"],
			usePolling: true,
		},
	},
	plugins: [musicTracksPlugin()],
});
