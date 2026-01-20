import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import * as mdxConfig from './source.config'

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      'fumadocs-mdx:collections/browser': './.source/browser.ts',
      'fumadocs-mdx:collections/dynamic': './.source/dynamic.ts',
      'fumadocs-mdx:collections/server': './.source/server.ts',
    },
  },
  plugins: [
    mdx(mdxConfig),
    nitro(),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      router: {
        routeFileIgnorePattern: '.*\\.txt\\.ts',
      },
    }),
    react(),
  ],
})
