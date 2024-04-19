import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import qwikdev from "@qwikdev/astro";
import icon from "astro-icon";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [qwikdev(), tailwind({ applyBaseStyles: false }), icon()],
  adapter: vercel(),
  image: {
    domains: ["themoviedb.org"],
  },
});
