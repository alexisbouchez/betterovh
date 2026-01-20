import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import * as mdxConfig from './source.config'

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    mdx(mdxConfig),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      router: {
        routeFileIgnorePattern: '.*\\.txt\\.ts',
      },
      prerender: {
        enabled: true,
      },
    }),
    react(),
  ],
})
