import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter(),
    alias: {
      $components: './src/lib/components',
      $utils: './src/lib/utils',
      $server: './src/lib/server',
      $types: './src/lib/types',
      $db: './src/lib/server/db',
    },
  },
};

export default config;
