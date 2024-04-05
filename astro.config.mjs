import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [qwikdev(), tailwind()],
});
