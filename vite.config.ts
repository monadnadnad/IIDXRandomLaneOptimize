import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import { crx, defineManifest  } from "@crxjs/vite-plugin";
import checker from "vite-plugin-checker";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Random Lane Ticket Tool",
  version: "1.0.1",
  permissions: [
    "activeTab",
    "storage",
    "tabs"
  ],
  content_scripts: [
    {
      "matches": ["https://p.eagate.573.jp/game/2dx/*/djdata/random_lane/*"],
      "js": ["src/content.ts"],
      "run_at": "document_end"
    }
  ],
});

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    crx({ manifest }),
  ],
});
