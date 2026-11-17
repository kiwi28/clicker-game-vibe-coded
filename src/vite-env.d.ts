/// <reference types="vite/client" />

declare module "virtual:music-tracks" {
	const tracks: ReadonlyArray<{ url: string; name: string }>;
	export default tracks;
}
