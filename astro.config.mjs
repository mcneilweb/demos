import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  integrations: [lit()],
});
