import { defineConfig } from "vite";

export default defineConfig({
	base: "./",
	server: {
		watch: {
			ignored: ["**/dist/**", "**/dist.zip", "**/graphify-out/**", "**/public/audio/**"],
			usePolling: true,
		},
	},
});
