import aspectRatioPlugin from '@tailwindcss/aspect-ratio';
import containerQueriesPlugin from '@tailwindcss/container-queries';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    typographyPlugin,
    formsPlugin,
    aspectRatioPlugin,
    containerQueriesPlugin,
    plugin(({ addVariant }) => {
      addVariant('hocus', ['&:enabled:hover', '&:enabled:focus-visible']);
    }),
  ],
} as Config;
